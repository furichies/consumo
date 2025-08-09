const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/api/payments/create', (req, res) => {
  const { amount_cents } = req.body;
  const paymentId = 'PAY-' + Math.random().toString(36).slice(2,10);
  const approval_url = `http://localhost:4001/pay/${paymentId}`;
  res.json({ paymentId, approval_url });
});

app.post('/api/payments/execute', (req, res) => {
  const { paymentId } = req.body;
  res.json({ paymentId, status: 'COMPLETED', transactionId: 'TX-' + Math.random().toString(36).slice(2,12) });
});

app.get('/pay/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  res.send(`<!doctype html><html><body style="font-family:Arial"><h3>Simulación PayPal</h3><p>Pago: ${paymentId}</p><form id="f"><button type="button" onclick="fetch('/api/pay/confirm',{method:'POST'}).then(()=>{alert('Pago completado (simulado). Vuelve a la app.');})">Pagar (simulado)</button></form></body></html>`);
});

app.post('/api/pay/confirm', (req,res)=>{ res.json({ ok:true }); });

const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=>console.log('Payment mock listening on', PORT));
