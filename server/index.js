import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded media
app.use('/uploads', express.static(uploadsDir));

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// API Routes for Websites
app.get('/api/websites', (req, res) => {
  const websites = readDb();
  res.json(websites);
});

app.get('/api/websites/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const websites = readDb();
  const found = websites.find(w => w.id === slugOrId || w.slug === slugOrId);
  if (found) {
    return res.json(found);
  }
  res.status(404).json({ error: 'Website not found' });
});

app.post('/api/websites', (req, res) => {
  const website = req.body;
  if (!website || !website.girlfriendName) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const list = readDb();
  const now = new Date().toISOString();
  
  if (!website.id) {
    website.id = 'ws-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  }
  if (!website.slug) {
    website.slug = website.girlfriendName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
  }
  website.updated_at = now;
  if (!website.created_at) {
    website.created_at = now;
  }

  const existingIdx = list.findIndex(w => w.id === website.id || w.slug === website.slug);
  if (existingIdx >= 0) {
    list[existingIdx] = website;
  } else {
    list.unshift(website);
  }

  writeDb(list);
  res.json(website);
});

app.delete('/api/websites/:id', (req, res) => {
  const { id } = req.params;
  let list = readDb();
  list = list.filter(w => w.id !== id);
  writeDb(list);
  res.json({ success: true, id });
});

app.listen(PORT, () => {
  console.log(`✨ Forever Us Server running on http://localhost:${PORT}`);
});
