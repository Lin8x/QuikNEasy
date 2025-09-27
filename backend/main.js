// File: server/index.js
const express = require('express');
const Database = require('better-sqlite3');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const db = new Database('./usda.db');
const PORT = 3001;
const USDA_API_KEY = 'YOUR_API_KEY'; // replace with your actual key

app.use(cors());

// Create usda_cache table
const init = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS usda_cache (
    fdcId INTEGER PRIMARY KEY,
    description TEXT,
    kcal REAL,
    protein REAL,
    carbs REAL,
    fat REAL,
    category TEXT,
    fetchedAt INTEGER
  )`).run();
};

// Classify by dominant kcal macro
const classify = (protein, fat, carbs) => {
  const p = protein * 4;
  const f = fat * 9;
  const c = carbs * 4;
  const max = Math.max(p, f, c);
  if (max === p) return 'PROTEIN';
  if (max === f) return 'FAT';
  if (max === c) return 'CARB';
  return 'OTHER';
};

// Fetch and store a food by FDC ID if not cached or stale
const fetchIfNeeded = async (fdcId) => {
  const now = Math.floor(Date.now() / 1000);
  const thirtyDays = 30 * 86400;
  const row = db.prepare(`SELECT * FROM usda_cache WHERE fdcId = ?`).get(fdcId);

  if (row && now - row.fetchedAt < thirtyDays) return row;

  const res = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);
  const data = await res.json();
  const getVal = name => data.foodNutrients.find(n => n.nutrientName === name)?.value || 0;

  const protein = getVal("Protein");
  const fat = getVal("Total lipid (fat)");
  const carbs = getVal("Carbohydrate, by difference");
  const kcal = getVal("Energy");
  const category = classify(protein, fat, carbs);

  db.prepare(`REPLACE INTO usda_cache VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    fdcId,
    data.description,
    kcal,
    protein,
    carbs,
    fat,
    category,
    now
  );

  return { fdcId, description: data.description, kcal, protein, carbs, fat, category };
};

// /api/packs: returns filtered foods
app.get('/api/packs', (req, res) => {
  const { macro, maxKcal, maxCarbs, maxFat } = req.query;
  const stmt = db.prepare(`SELECT * FROM usda_cache WHERE category = ? AND kcal <= ? AND carbs <= ? AND fat <= ?`);
  const rows = stmt.all(macro, Number(maxKcal), Number(maxCarbs), Number(maxFat));
  res.json(rows);
});

// /api/fetch/:fdcId: manually load a food into cache
app.get('/api/fetch/:fdcId', async (req, res) => {
  const fdcId = Number(req.params.fdcId);
  const data = await fetchIfNeeded(fdcId);
  res.json(data);
});

init();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
