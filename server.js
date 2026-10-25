import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import QRCode from 'qrcode';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const siteUrl = (process.env.SITE_URL || `http://localhost:${port}`).replace(/\/$/, '');
const dbDir = path.join(__dirname, 'data');
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(dbDir, { recursive: true }); fs.mkdirSync(uploadDir, { recursive: true });
const db = new Database(path.join(dbDir, 'mangaskino.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, vip_until TEXT);
CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT '', filename TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, invoice_id TEXT, sender_invoice_no TEXT UNIQUE NOT NULL, amount INTEGER NOT NULL, status TEXT DEFAULT 'PENDING', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(session({
  name: 'mk.sid', secret: process.env.SESSION_SECRET || 'dev-only-change-me',
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({ destination: uploadDir, filename: (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
}});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  const ok = ['video/mp4','video/webm','video/quicktime','video/x-matroska'].includes(file.mimetype);
  cb(ok ? null : new Error('Зөвхөн MP4, WebM, MOV эсвэл MKV видео оруулна уу.'), ok);
}});

const currentUser = (req) => req.session.userId ? db.prepare('SELECT id,email,vip_until FROM users WHERE id=?').get(req.session.userId) : null;
function requireUser(req, res, next) { if (!currentUser(req)) return res.status(401).json({ error: 'Эхлээд нэвтэрнэ үү.' }); next(); }
function requireAdmin(req, res, next) { const expected = process.env.ADMIN_KEY; if (!expected || req.get('x-admin-key') !== expected) return res.status(401).json({ error: 'Админ түлхүүр буруу байна.' }); next(); }
function isVip(user) { return !!(user?.vip_until && new Date(user.vip_until).getTime() > Date.now()); }

app.get('/api/me', (req,res) => { const u=currentUser(req); res.json({ user: u ? { id:u.id,email:u.email,vip: isVip(u),vip_until:u.vip_until } : null }); });
app.post('/api/register', async (req,res) => {
  const email=String(req.body.email||'').trim().toLowerCase(); const password=String(req.body.password||'');
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({error:'Зөв имэйл болон 8-аас дээш тэмдэгттэй нууц үг оруулна уу.'});
  try { const hash=await bcrypt.hash(password,12); const result=db.prepare('INSERT INTO users(email,password_hash) VALUES(?,?)').run(email,hash); req.session.userId=result.lastInsertRowid; res.json({ok:true}); }
  catch { res.status(409).json({error:'Энэ имэйлээр бүртгэл үүссэн байна.'}); }
});
app.post('/api/login', async (req,res) => {
  const email=String(req.body.email||'').trim().toLowerCase(); const password=String(req.body.password||'');
  const u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!u || !(await bcrypt.compare(password,u.password_hash))) return res.status(401).json({error:'Имэйл эсвэл нууц үг буруу байна.'});
  req.session.userId=u.id; res.json({ok:true});
});
app.post('/api/logout',(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get('/api/movies',(_req,res)=>res.json(db.prepare('SELECT id,title,description,created_at FROM movies ORDER BY id DESC').all()));
app.post('/api/admin/movies',requireAdmin,upload.single('video'),(req,res)=>{
  if (!req.file) return res.status(400).json({error:'Видео файл шаардлагатай.'});
  const title=String(req.body.title||'').trim(); if (!title) { fs.unlinkSync(req.file.path); return res.status(400).json({error:'Киноны нэр оруулна уу.'}); }
  const info=db.prepare('INSERT INTO movies(title,description,filename) VALUES(?,?,?)').run(title,String(req.body.description||'').slice(0,2000),req.file.filename);
  res.json({ok:true,id:info.lastInsertRowid});
});
app.get('/api/watch/:id',requireUser,(req,res)=>{
  const u=currentUser(req); if (!isVip(u)) return res.status(403).json({error:'Кино үзэхийн тулд VIP эрх авна уу.'});
  const movie=db.prepare('SELECT filename FROM movies WHERE id=?').get(Number(req.params.id));
  if (!movie) return res.status(404).json({error:'Кино олдсонгүй.'});
  const file=path.join(uploadDir,movie.filename); if (!fs.existsSync(file)) return res.status(404).json({error:'Видео файл олдсонгүй.'});
  res.setHeader('Content-Type', ({'.mp4':'video/mp4','.webm':'video/webm','.mov':'video/quicktime','.mkv':'video/x-matroska'})[path.extname(file).toLowerCase()] || 'application/octet-stream');
  res.setHeader('Cache-Control','private, no-store');
  res.sendFile(file);
});

async function qpayToken() {
  const username=process.env.QPAY_USERNAME, password=process.env.QPAY_PASSWORD;
  if (!username || !password) throw new Error('QPay credentials .env файлд тохируулагдаагүй байна.');
  const r=await fetch(`${process.env.QPAY_BASE_URL || 'https://merchant-sandbox.qpay.mn'}/v2/auth/token`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,'Content-Type':'application/json'}});
  if (!r.ok) throw new Error(`QPay token алдаа: ${r.status}`); return (await r.json()).access_token;
}
async function qpayPost(endpoint, token, body) {
  const r=await fetch(`${process.env.QPAY_BASE_URL || 'https://merchant-sandbox.qpay.mn'}${endpoint}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await r.json().catch(()=>({})); if(!r.ok) throw new Error(`QPay ${endpoint} алдаа (${r.status}): ${JSON.stringify(data)}`); return data;
}
app.post('/api/payments/qpay',requireUser,async(req,res)=>{
  try {
    if (!process.env.QPAY_INVOICE_CODE) return res.status(503).json({error:'QPay invoice_code тохируулагдаагүй. QPay мерчантын мэдээлэл шаардлагатай.'});
    const user=currentUser(req); if (isVip(user)) return res.json({ok:true,alreadyVip:true});
    const amount=Number(process.env.VIP_PRICE_MNT||9900); const senderInvoiceNo=`MK-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const token=await qpayToken();
    const invoice=await qpayPost('/v2/invoice',token,{invoice_code:process.env.QPAY_INVOICE_CODE,sender_invoice_no:senderInvoiceNo,invoice_receiver_code:'terminal',invoice_description:`MangasKino VIP ${process.env.VIP_DAYS||30} honog`,amount,callback_url:`${siteUrl}/api/payments/qpay/callback`});
    db.prepare('INSERT INTO invoices(user_id,invoice_id,sender_invoice_no,amount) VALUES(?,?,?,?)').run(user.id,invoice.invoice_id,senderInvoiceNo,amount);
    let qrDataUrl=null; if(invoice.qr_image) { try { qrDataUrl=invoice.qr_image.startsWith('data:') ? invoice.qr_image : `data:image/png;base64,${invoice.qr_image}`; } catch {} }
    if (!qrDataUrl && invoice.qr_text) qrDataUrl=await QRCode.toDataURL(invoice.qr_text);
    res.json({ok:true,invoiceId:invoice.invoice_id,qrImage:qrDataUrl,qrText:invoice.qr_text||null,urls:invoice.urls||[],amount});
  } catch(e) { console.error(e.message); res.status(502).json({error:'QPay нэхэмжлэх үүсгэж чадсангүй. .env болон мерчантын тохиргоогоо шалгана уу.'}); }
});
// QPay callback is only a notification. We independently verify payment against QPay before granting VIP.
app.post('/api/payments/qpay/callback',async(req,res)=>{
  try {
    const invoiceId=String(req.body?.invoice_id || req.query?.invoice_id || '');
    if (!invoiceId) return res.status(400).send('invoice_id required');
    const row=db.prepare('SELECT * FROM invoices WHERE invoice_id=?').get(invoiceId);
    if (!row) return res.status(404).send('invoice not found');
    if (row.status !== 'PAID') {
      const token=await qpayToken(); const check=await qpayPost('/v2/payment/check',token,{object_type:'INVOICE',object_id:invoiceId});
      const rows=check.rows || []; const paid=rows.some(p=>String(p.payment_status).toUpperCase()==='PAID' && Number(p.payment_amount) >= row.amount);
      if (paid && Number(check.paid_amount) >= row.amount) {
        const until=new Date(Date.now()+Number(process.env.VIP_DAYS||30)*86400000).toISOString();
        const tx=db.transaction(()=>{ db.prepare("UPDATE invoices SET status='PAID' WHERE id=?").run(row.id); db.prepare('UPDATE users SET vip_until=? WHERE id=?').run(until,row.user_id); }); tx();
      }
    }
    res.status(200).send('ok');
  } catch(e) { console.error('QPay callback verify failed:',e.message); res.status(500).send('verification failed'); }
});
app.get('/api/payments/status/:invoiceId',requireUser,(req,res)=>{
  const row=db.prepare('SELECT status,amount FROM invoices WHERE invoice_id=? AND user_id=?').get(String(req.params.invoiceId),currentUser(req).id);
  if(!row) return res.status(404).json({error:'Нэхэмжлэх олдсонгүй.'});
  res.json({status:row.status,amount:row.amount});
});
app.get('/api/admin/health',requireAdmin,(_req,res)=>res.json({ok:true,movies:db.prepare('SELECT count(*) n FROM movies').get().n}));
app.use((err,_req,res,_next)=>{ console.error(err.message); res.status(400).json({error:err.message || 'Хүсэлт амжилтгүй.'}); });
app.listen(port,()=>console.log(`MangasKino running at ${siteUrl}`));
