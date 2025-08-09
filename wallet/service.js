const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const db = new Database('./wallet.db');

db.prepare(`CREATE TABLE IF NOT EXISTS wallet_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT UNIQUE,
  balance_cents INTEGER DEFAULT 0
)`).run();

const app = express(); app.use(bodyParser.json());

app.post('/api/wallet/register', (req,res)=>{ const { email } = req.body; try{ db.prepare('INSERT OR IGNORE INTO wallet_users (user_email,balance_cents) VALUES (?,?)').run(email,0); const row = db.prepare('SELECT * FROM wallet_users WHERE user_email = ?').get(email); res.json({ ok:true, wallet: row }); }catch(e){ res.status(500).json({ error:e.message }) }});

app.get('/api/wallet/:email', (req,res)=>{ const row = db.prepare('SELECT * FROM wallet_users WHERE user_email = ?').get(req.params.email); if(!row) return res.status(404).json({ error:'not found' }); res.json(row); });

app.post('/api/wallet/topup', (req,res)=>{ const { email, amount_cents } = req.body; const u = db.prepare('SELECT * FROM wallet_users WHERE user_email=?').get(email); if(!u) return res.status(404).json({ error:'wallet not found' }); db.prepare('UPDATE wallet_users SET balance_cents = balance_cents + ? WHERE user_email = ?').run(amount_cents, email); const updated = db.prepare('SELECT * FROM wallet_users WHERE user_email = ?').get(email); res.json({ ok:true, wallet: updated }); });

app.post('/api/wallet/charge', (req,res)=>{ const { email, amount_cents } = req.body; const u = db.prepare('SELECT * FROM wallet_users WHERE user_email=?').get(email); if(!u) return res.status(404).json({ error:'wallet not found' }); if (u.balance_cents < amount_cents) return res.status(400).json({ error:'insufficient funds' }); db.prepare('UPDATE wallet_users SET balance_cents = balance_cents - ? WHERE user_email = ?').run(amount_cents, email); const updated = db.prepare('SELECT * FROM wallet_users WHERE user_email = ?').get(email); res.json({ ok:true, wallet: updated }); });

const PORT = process.env.PORT || 4100; app.listen(PORT, ()=>console.log('Wallet service on', PORT));
