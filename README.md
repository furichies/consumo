# Consumo App - Complete (with payment mock + wallet)

## Quick start

1. Make script executable: `chmod +x setup.sh`
2. Run: `./setup.sh` (requires Docker & Docker Compose)
3. Open `http://localhost:5173`

Seed users:
- admin@example.com / adminpass  (admin)
- user@example.com  / userpass   (user)

Services:
- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- Payment mock: http://localhost:4001
- Wallet: http://localhost:4100

Notes:
- Frontend defaults to `http://localhost:5000/api` so you can run it outside Docker if you prefer.
- If you have build errors for `better-sqlite3` on Alpine, change backend Dockerfile to use `node:18-bullseye` (I included Alpine + build tools, but some environments vary).
