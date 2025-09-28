// File: server/index.js
const express = require('express');
const Database = require('better-sqlite3');
const fetch = require('node-fetch'); // On Node >=18 you can use global fetch
const cors = require('cors');

const app = express();
const db = new Database('./usda.db');
const PORT = 3001;

// ===== CONFIG =====
const USDA_API_KEY = process.env.USDA_API_KEY || 'REPLACE_ME';
const BULK_DAYS_TTL = 30;                   // refresh window (days)
const BULK_DEFAULT_QUERIES = [
  // broad coverage, adjust as you like
  'chicken','beef','pork','turkey','egg','milk','cheese','yogurt',
  'rice','pasta','bread','oats','beans','lentils','tofu',
  'apple','banana','orange','strawberry','blueberry','grape',
  'broccoli','spinach','kale','carrot','potato','tomato','onion','pepper',
  'salmon','tuna','shrimp','cod','sardine','mackerel','peanut butter','almond'
];
const BULK_PAGE_SIZE = 200;                 // USDA search page size (cap at 200)
const BULK_MAX_PAGES_PER_QUERY = 5;         // avoid unbounded pulls
const BULK_DELAY_MS = 120;                  // small pause between HTTP calls

app.use(cors());
app.use(express.json());

// ============ DB INIT ============
function init() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS usda_cache (
      fdcId INTEGER PRIMARY KEY,
      description TEXT,
      kcal REAL,
      protein REAL,
      carbs REAL,
      fat REAL,
      category TEXT,
      fetchedAt INTEGER,
      nutrients TEXT
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // helpful indexes
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_usda_desc ON usda_cache(description)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_usda_cat ON usda_cache(category)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_usda_macros ON usda_cache(category, protein, carbs, fat, kcal)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_usda_time ON usda_cache(fetchedAt DESC)`).run();
}

function getMeta(key) {
  return db.prepare(`SELECT value FROM meta WHERE key = ?`).get(key)?.value ?? null;
}
function setMeta(key, value) {
  db.prepare(`REPLACE INTO meta (key, value) VALUES (?, ?)`).run(key, value);
}

// ========= NUTRIENT HELPERS (robust to USDA schema variants) =========
function normN(n) {
  if (!n || typeof n !== 'object') return null;
  // Newer schema: { nutrient: { name, unitName }, amount }
  if (n.nutrient && (n.amount !== undefined)) {
    const name = n.nutrient.name || n.nutrient.nutrientName || '';
    const unit = n.nutrient.unitName || n.unitName || '';
    const val  = typeof n.amount === 'number' ? n.amount : Number(n.amount) || 0;
    return { name, unit, value: val };
  }
  // Older: nutrientName, unitName, value
  const name = n.nutrientName || '';
  const unit = n.unitName || '';
  const val  = typeof n.value === 'number' ? n.value : Number(n.value) || 0;
  return { name, unit, value: val };
}

function extractAllNutrients(food) {
  const arr = Array.isArray(food.foodNutrients) ? food.foodNutrients : [];
  return arr.map(normN).filter(Boolean);
}

function getByName(food, target) {
  const arr = extractAllNutrients(food);
  const hit = arr.find(x => x.name === target);
  return hit ? hit.value : 0;
}

function getEnergyKcal(food) {
  const arr = extractAllNutrients(food);
  const en = arr.find(x => x.name === 'Energy');
  if (!en) return 0;
  const unit = (en.unit || '').toLowerCase();
  if (unit === 'kj') return en.value / 4.184;
  return en.value; // assume kcal
}

// ========= CLASSIFY =========
function classify(protein, fat, carbs) {
  const p = (Number(protein) || 0) * 4;
  const f = (Number(fat) || 0) * 9;
  const c = (Number(carbs) || 0) * 4;
  const max = Math.max(p, f, c);
  if (max === p) return 'PROTEIN';
  if (max === f) return 'FAT';
  if (max === c) return 'CARB';
  return 'OTHER';
}

// ========= CORE FETCH / UPSERT =========
async function fetchFoodDetail(fdcId) {
  const resp = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);
  if (!resp.ok) throw new Error(`USDA detail failed: ${resp.status} ${resp.statusText}`);
  return resp.json();
}

function upsertFoodFromUSDA(food) {
  const protein = getByName(food, 'Protein');
  const fat     = getByName(food, 'Total lipid (fat)');
  const carbs   = getByName(food, 'Carbohydrate, by difference');
  const kcal    = getEnergyKcal(food);
  const cat     = classify(protein, fat, carbs);
  const now     = Math.floor(Date.now() / 1000);
  const nutrientsJson = JSON.stringify(extractAllNutrients(food));

  db.prepare(`
    REPLACE INTO usda_cache
      (fdcId, description, kcal, protein, carbs, fat, category, fetchedAt, nutrients)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    food.fdcId,
    food.description || '',
    Number(kcal) || 0,
    Number(protein) || 0,
    Number(carbs) || 0,
    Number(fat) || 0,
    cat,
    now,
    nutrientsJson
  );
}

async function fetchIfNeeded(fdcId) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = 30 * 86400; // 30 days per-item freshness
  const row = db.prepare(`SELECT * FROM usda_cache WHERE fdcId = ?`).get(fdcId);
  if (row && now - row.fetchedAt < ttl) return row;
  const food = await fetchFoodDetail(fdcId);
  upsertFoodFromUSDA(food);
  return db.prepare(`SELECT * FROM usda_cache WHERE fdcId = ?`).get(fdcId);
}

// ========= BULK REFRESH =========
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function usdaSearch(query, page, pageSize) {
  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
  url.searchParams.set('api_key', USDA_API_KEY);
  url.searchParams.set('query', query);
  url.searchParams.set('pageNumber', String(page));
  url.searchParams.set('pageSize', String(pageSize));
  // You can add filters like dataType if desired
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(`USDA search failed: ${resp.status} ${resp.statusText}`);
  return resp.json();
}

async function bulkRefresh(opts = {}) {
  const {
    queries = BULK_DEFAULT_QUERIES,
    pageSize = BULK_PAGE_SIZE,
    maxPagesPerQuery = BULK_MAX_PAGES_PER_QUERY,
    delayMs = BULK_DELAY_MS
  } = opts;

  const seen = new Set(); // avoid duplicate detail fetches
  for (const q of queries) {
    for (let page = 1; page <= maxPagesPerQuery; page++) {
      const data = await usdaSearch(q, page, pageSize);
      const foods = Array.isArray(data.foods) ? data.foods : [];
      if (foods.length === 0) break;

      for (const f of foods) {
        if (!f?.fdcId || seen.has(f.fdcId)) continue;
        seen.add(f.fdcId);
        try {
          const detail = await fetchFoodDetail(f.fdcId);
          upsertFoodFromUSDA(detail);
        } catch (e) {
          // continue on individual errors
        }
        if (delayMs > 0) await sleep(delayMs);
      }

      // If fewer than a full page returned, stop paging for this query
      if (foods.length < pageSize) break;
      if (delayMs > 0) await sleep(delayMs);
    }
  }
  setMeta('last_bulk_fetch', String(Math.floor(Date.now() / 1000)));
}

// ========= FILTER HELPERS =========
const numOrNull = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const readOp = (req, field, which) => {
  const v = req.query?.[field]?.[which];
  return numOrNull(v);
};

// ============ ROUTES ============

// Manual bulk refresh trigger (GET for simplicity)
// Examples:
//   /admin/bulk-refresh
//   /admin/bulk-refresh?queries=chicken,beef&maxPages=3&pageSize=100
app.get('/admin/bulk-refresh', async (req, res) => {
  try {
    const queries = (req.query.queries || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const maxPages = numOrNull(req.query.maxPages) ?? BULK_MAX_PAGES_PER_QUERY;
    const pageSize = Math.min(Math.max(numOrNull(req.query.pageSize) ?? BULK_PAGE_SIZE, 1), 200);

    await bulkRefresh({
      queries: queries.length ? queries : BULK_DEFAULT_QUERIES,
      pageSize,
      maxPagesPerQuery: maxPages
    });

    const last = getMeta('last_bulk_fetch');
    res.json({ ok: true, last_bulk_fetch: last, queries: queries.length ? queries : BULK_DEFAULT_QUERIES });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Last bulk fetch timestamp
app.get('/admin/status', (req, res) => {
  const last = getMeta('last_bulk_fetch');
  res.json({ last_bulk_fetch: last ? Number(last) : null });
});

// GET /foods — list with filters; no filters returns everything (paginated)
app.get('/foods', (req, res) => {
  try {
    const allowedSort = new Set(['fetchedAt','description','kcal','protein','fat','carbs','fdcId','category']);
    const limit = Math.max(1, Math.min(parseInt(req.query.limit ?? '50', 10), 500));
    const offset = Math.max(0, parseInt(req.query.offset ?? '0', 10));
    const sort = allowedSort.has(req.query.sort) ? req.query.sort : 'fetchedAt';
    const dir = (req.query.dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim().toUpperCase();

    const protein_gte = readOp(req, 'protein', 'gte');
    const protein_lte = readOp(req, 'protein', 'lte');
    const carbs_gte   = readOp(req, 'carbs',   'gte');
    const carbs_lte   = readOp(req, 'carbs',   'lte');
    const fat_gte     = readOp(req, 'fat',     'gte');
    const fat_lte     = readOp(req, 'fat',     'lte');
    const kcal_gte    = readOp(req, 'calories','gte');
    const kcal_lte    = readOp(req, 'calories','lte');

    const where = [];
    const params = { limit, offset };

    if (q)        { where.push('description LIKE @q'); params.q = `%${q}%`; }
    if (category) { where.push('category = @category'); params.category = category; }
    if (protein_gte !== null) { where.push('protein >= @protein_gte'); params.protein_gte = protein_gte; }
    if (protein_lte !== null) { where.push('protein <= @protein_lte'); params.protein_lte = protein_lte; }
    if (carbs_gte   !== null) { where.push('carbs   >= @carbs_gte');   params.carbs_gte   = carbs_gte; }
    if (carbs_lte   !== null) { where.push('carbs   <= @carbs_lte');   params.carbs_lte   = carbs_lte; }
    if (fat_gte     !== null) { where.push('fat     >= @fat_gte');     params.fat_gte     = fat_gte; }
    if (fat_lte     !== null) { where.push('fat     <= @fat_lte');     params.fat_lte     = fat_lte; }
    if (kcal_gte    !== null) { where.push('kcal    >= @kcal_gte');    params.kcal_gte    = kcal_gte; }
    if (kcal_lte    !== null) { where.push('kcal    <= @kcal_lte');    params.kcal_lte    = kcal_lte; }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const items = db.prepare(`
      SELECT fdcId, description AS name, protein, fat, carbs, kcal, category, fetchedAt
      FROM usda_cache
      ${whereSQL}
      ORDER BY ${sort} ${dir}
      LIMIT @limit OFFSET @offset
    `).all(params);

    const total = db.prepare(`SELECT COUNT(*) AS c FROM usda_cache ${whereSQL}`).get(params).c;

    res.json({
      items, total, limit, offset,
      hasMore: offset + items.length < total,
      sort, dir,
      filters: {
        q, category,
        protein_gte, protein_lte,
        carbs_gte, carbs_lte,
        fat_gte, fat_lte,
        calories_gte: kcal_gte, calories_lte: kcal_lte
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /foods/id/:id — detail (includes nutrients), fetches if missing/stale
app.get('/foods/id/:id', async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const row = await fetchIfNeeded(idNum);
    res.json({
      fdcId: row.fdcId,
      name: row.description,
      protein: row.protein,
      fat: row.fat,
      carbs: row.carbs,
      kcal: row.kcal,
      category: row.category,
      fetchedAt: row.fetchedAt,
      nutrients: row.nutrients ? JSON.parse(row.nutrients) : []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /foods/name/:name — exact (case-insensitive), includes nutrients
app.get('/foods/name/:name', (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name || '').trim();
    if (!name) return res.status(400).json({ error: 'name required' });

    const row = db.prepare(`
      SELECT fdcId, description AS name, protein, fat, carbs, kcal, category, fetchedAt, nutrients
      FROM usda_cache
      WHERE description = ? COLLATE NOCASE
    `).get(name);

    if (!row) return res.status(404).json({ error: 'not found' });

    res.json({
      ...row,
      nutrients: row.nutrients ? JSON.parse(row.nutrients) : []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /foods/category/:category — list with same filters
app.get('/foods/category/:category', (req, res) => {
  try {
    const category = (req.params.category || '').trim().toUpperCase();
    if (!category) return res.status(400).json({ error: 'category required' });

    const allowedSort = new Set(['fetchedAt','description','kcal','protein','fat','carbs','fdcId','category']);
    const limit = Math.max(1, Math.min(parseInt(req.query.limit ?? '50', 10), 500));
    const offset = Math.max(0, parseInt(req.query.offset ?? '0', 10));
    const sort = allowedSort.has(req.query.sort) ? req.query.sort : 'fetchedAt';
    const dir = (req.query.dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const protein_gte = readOp(req, 'protein', 'gte');
    const protein_lte = readOp(req, 'protein', 'lte');
    const carbs_gte   = readOp(req, 'carbs',   'gte');
    const carbs_lte   = readOp(req, 'carbs',   'lte');
    const fat_gte     = readOp(req, 'fat',     'gte');
    const fat_lte     = readOp(req, 'fat',     'lte');
    const kcal_gte    = readOp(req, 'calories','gte');
    const kcal_lte    = readOp(req, 'calories','lte');

    const where = ['category = @category'];
    const params = { category, limit, offset };

    if (protein_gte !== null) { where.push('protein >= @protein_gte'); params.protein_gte = protein_gte; }
    if (protein_lte !== null) { where.push('protein <= @protein_lte'); params.protein_lte = protein_lte; }
    if (carbs_gte   !== null) { where.push('carbs   >= @carbs_gte');   params.carbs_gte   = carbs_gte; }
    if (carbs_lte   !== null) { where.push('carbs   <= @carbs_lte');   params.carbs_lte   = carbs_lte; }
    if (fat_gte     !== null) { where.push('fat     >= @fat_gte');     params.fat_gte     = fat_gte; }
    if (fat_lte     !== null) { where.push('fat     <= @fat_lte');     params.fat_lte     = fat_lte; }
    if (kcal_gte    !== null) { where.push('kcal    >= @kcal_gte');    params.kcal_gte    = kcal_gte; }
    if (kcal_lte    !== null) { where.push('kcal    <= @kcal_lte');    params.kcal_lte    = kcal_lte; }

    const whereSQL = `WHERE ${where.join(' AND ')}`;

    const items = db.prepare(`
      SELECT fdcId, description AS name, protein, fat, carbs, kcal, category, fetchedAt
      FROM usda_cache
      ${whereSQL}
      ORDER BY ${sort} ${dir}
      LIMIT @limit OFFSET @offset
    `).all(params);

    const total = db.prepare(`SELECT COUNT(*) AS c FROM usda_cache ${whereSQL}`).get(params).c;

    res.json({
      items, total, limit, offset,
      hasMore: offset + items.length < total,
      category, sort, dir,
      filters: {
        protein_gte, protein_lte,
        carbs_gte, carbs_lte,
        fat_gte, fat_lte,
        calories_gte: kcal_gte, calories_lte: kcal_lte
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ BOOT + SCHEDULE ============

init();

// Kick off an initial check: if last bulk fetch is older than TTL, refresh now.
(async () => {
  try {
    const last = Number(getMeta('last_bulk_fetch') || 0);
    const now = Math.floor(Date.now() / 1000);
    const ttl = BULK_DAYS_TTL * 86400;
    if (!last || now - last > ttl) {
      await bulkRefresh();
    }
  } catch (_e) {
    // ignore startup refresh failures; server still serves existing cache
  }
})();

// Daily check: if > TTL since last bulk, run bulk refresh
setInterval(async () => {
  try {
    const last = Number(getMeta('last_bulk_fetch') || 0);
    const now = Math.floor(Date.now() / 1000);
    const ttl = BULK_DAYS_TTL * 86400;
    if (!last || now - last > ttl) {
      await bulkRefresh();
    }
  } catch (_e) {}
}, 24 * 60 * 60 * 1000); // every 24h

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
