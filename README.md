# Quiz 0.1 — Запуск

## Требования
- [Node.js](https://nodejs.org/) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 1. MongoDB (Docker)
```bash
docker compose up -d
```

## 2. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed   # один раз — заполнить базу
npm run dev    # http://localhost:5000
```

## 3. Frontend
```bash
cd frontend
npm install
npm start      # http://localhost:3000
```

---

Открыть в браузере: **http://localhost:3000**
# quiz_result_un
