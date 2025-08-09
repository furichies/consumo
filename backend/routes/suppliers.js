const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req,res)=>{
  res.json(db.prepare('SELECT * FROM suppliers').all());
});

router.post('/', (req,res)=>{
  const { name, contact } = req.body;
  const info = db.prepare('INSERT INTO suppliers (name,contact) VALUES (?,?)').run(name,contact);
  res.json(db.prepare('SELECT * FROM suppliers WHERE id=?').get(info.lastInsertRowid));
});

router.put('/:id', (req,res)=>{
  const id = req.params.id;
  const { name, contact } = req.body;
  db.prepare('UPDATE suppliers SET name=?, contact=? WHERE id=?').run(name, contact, id);
  res.json(db.prepare('SELECT * FROM suppliers WHERE id=?').get(id));
});

router.delete('/:id', (req,res)=>{
  const id = req.params.id;
  db.prepare('DELETE FROM suppliers WHERE id=?').run(id);
  res.json({ deleted: true, id });
});

module.exports = router;
