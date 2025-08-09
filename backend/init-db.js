const db = require('./db');
const bcrypt = require('bcryptjs');

function run(sql){ db.prepare(sql).run(); }

// Drop for idempotence
run(`DROP TABLE IF EXISTS cart_items`);
run(`DROP TABLE IF EXISTS order_items`);
run(`DROP TABLE IF EXISTS orders`);
run(`DROP TABLE IF EXISTS products`);
run(`DROP TABLE IF EXISTS suppliers`);
run(`DROP TABLE IF EXISTS users`);

run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT)`);
run(`CREATE TABLE suppliers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, contact TEXT)`);
run(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price_cents INTEGER, stock INTEGER, supplier_id INTEGER, image_url TEXT, FOREIGN KEY (supplier_id) REFERENCES suppliers(id))`);
run(`CREATE TABLE cart_items (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, user_id INTEGER, product_id INTEGER, qty INTEGER, created_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id))`);
run(`CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total_cents INTEGER, created_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);
run(`CREATE TABLE order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, product_id INTEGER, qty INTEGER, unit_price_cents INTEGER, FOREIGN KEY(order_id) REFERENCES orders(id), FOREIGN KEY(product_id) REFERENCES products(id))`);

// Users
const adminPass = bcrypt.hashSync('adminpass', 8);
const userPass = bcrypt.hashSync('userpass', 8);
db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run('Admin','admin@example.com',adminPass,'admin');
db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run('Usuario','user@example.com',userPass,'user');

// Suppliers
const s1 = db.prepare('INSERT INTO suppliers (name,contact) VALUES (?,?)').run('Hortícola Andaluza','horticola@example.com').lastInsertRowid;
const s2 = db.prepare('INSERT INTO suppliers (name,contact) VALUES (?,?)').run('Lácteos del Norte','lacteos@example.com').lastInsertRowid;
const s3 = db.prepare('INSERT INTO suppliers (name,contact) VALUES (?,?)').run('Carnes Premium','carnes@example.com').lastInsertRowid;

// Products (using local images)
const p = db.prepare('INSERT INTO products (name,category,price_cents,stock,supplier_id,image_url) VALUES (?,?,?,?,?,?)');
p.run('Lechuga romana','verdura',120,50,s1,'/imgs/lechuga_romana.png');
p.run('Tomate rama','verdura',200,40,s1,'/imgs/tomate_rama.png');
p.run('Zanahoria bolsa 1kg','verdura',150,60,s1,'/imgs/Zanahoria_bolsa_1kg.png');
p.run('Leche entera 1L','lacteo',90,100,s2,'/imgs/Leche_entera_1L .png');
p.run('Yogur natural 4x125g','lacteo',250,80,s2,'/imgs/Yogur_natural_4x125g.png');
p.run('Queso fresco 300g','lacteo',320,35,s2,'/imgs/Queso_fresco_300g.png');
p.run('Pollo entero','carne',650,20,s3,'/imgs/Pollo_entero.png');
p.run('Filete ternera 500g','carne',1200,15,s3,'/imgs/Filete_ternera_500g.png');
p.run('Chorizo artesano 300g','carne',450,25,s3,'/imgs/Chorizo_artesano_300g.png');
p.run('Bollo de nata','panaderia',180,30,s1,'/imgs/bollo_nata.png');

// Sample orders
const now = new Date().toISOString();
const order1 = db.prepare('INSERT INTO orders (user_id,total_cents,created_at) VALUES (?,?,?)').run(2, (120+200), now).lastInsertRowid; // user id 2
db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)').run(order1,1,1,120);
db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)').run(order1,2,1,200);

const order2 = db.prepare('INSERT INTO orders (user_id,total_cents,created_at) VALUES (?,?,?)').run(2, (650*2), now).lastInsertRowid;
db.prepare('INSERT INTO order_items (order_id,product_id,qty,unit_price_cents) VALUES (?,?,?,?)').run(order2,7,2,650);

console.log('Database initialized with seed data.');
