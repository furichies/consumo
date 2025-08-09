const express = require('express'); const router = express.Router(); const db = require('../db'); const fetch = require('node-fetch');

router.get('/', (req,res)=>{ res.json(db.prepare('SELECT * FROM orders ORDER BY id DESC').all()); });

router.post('/checkout', async (req,res)=>{
  try{
    const { userId, items, payment_method, wallet_email, paypal } = req.body;
    if(!items || !items.length) return res.status(400).json({ error: 'No items' });
    // calculate total
    let total = 0;
    for(const it of items){
      const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId);
      const unit = p.price_cents;
      total += unit * it.qty;
    }

    if(payment_method === 'wallet'){
      // call wallet service
      const resp = await fetch('http://wallet:4100/api/wallet/charge', {
        method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ email: wallet_email, amount_cents: total })
      });
      if(resp.status !== 200){ const e = await resp.json().catch(()=>({})); return res.status(400).json({ error: 'Wallet payment failed', detail: e }); }
      // continue to create order
    } else if(payment_method === 'paypal'){
      // create paypal payment and return approval url
      const resp = await fetch('http://payment:4001/api/payments/create', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ amount_cents: total, return_url: paypal && paypal.return_url, cancel_url: paypal && paypal.cancel_url }) });
      const payJson = await resp.json();
      return res.json({ ok:true, payment: payJson });
    }

    // create order
    const now = new Date().toISOString();
    const info = db.prepare('INSERT INTO orders (user_id,total_cents,created_at) VALUES (?,?,?)').run(userId||null,0,now);
    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)');
    for(const it of items){
      const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId);
      insertItem.run(orderId, it.productId, it.qty, p.price_cents);
      db.prepare('UPDATE products SET stock = stock - ? WHERE id=?').run(it.qty, it.productId);
    }
    db.prepare('UPDATE orders SET total_cents = ? WHERE id=?').run(total, orderId);
    res.json({ ok:true, orderId, total_cents: total });
  }catch(e){ console.error(e); res.status(500).json({ error: 'server error', detail: e.message }); }
});

// endpoint to execute paypal payment after user approves
router.post('/execute-paypal', async (req,res)=>{
  try{
    const { paymentId, payerId, userId, items } = req.body;
    // call payment service to execute
    const resp = await fetch('http://payment:4001/api/payments/execute', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ paymentId, payerId }) });
    const json = await resp.json();
    if(json.status !== 'COMPLETED') return res.status(400).json({ error: 'Payment not completed' });
    // create order same as above
    let total = 0; for(const it of items){ const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId); total += p.price_cents * it.qty; }
    const now = new Date().toISOString(); const info = db.prepare('INSERT INTO orders (user_id,total_cents,created_at) VALUES (?,?,?)').run(userId||null,0,now); const orderId = info.lastInsertRowid; const insertItem = db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)'); for(const it of items){ const p = db.prepare('SELECT * FROM products WHERE id=?').get(it.productId); insertItem.run(orderId,it.productId,it.qty,p.price_cents); db.prepare('UPDATE products SET stock = stock - ? WHERE id=?').run(it.qty,it.productId); } db.prepare('UPDATE orders SET total_cents = ? WHERE id=?').run(total,orderId); res.json({ ok:true, orderId, total_cents: total, transaction: json });
  }catch(e){ console.error(e); res.status(500).json({ error: e.message }); }
});

module.exports = router;
