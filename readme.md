# Campus Commute
**Full‑stack Real‑Time Bus Tracking System**

Campus Commute is the frontend application of the Nexus‑E3 project: a Progressive Web App that allows students, drivers and administrators to interact with campus transportation in real time. It works alongside a light Express/MongoDB backend located in the parent `backend/` folder.

---

## 🚀 Overview
This repository contains both the **Campus‑Commute frontend** (React/TypeScript/PWA) and the **backend API** (Node.js/Express/MongoDB). The application enables: user registration/login, role‑based dashboards, real‑time map tracking using Leaflet, and configuration of routes and buses.

---

## ✨ Features

- Role‑based authentication (student, driver, admin)
- Real-time bus location visualization on a Leaflet map
- Route selection and assignment
- Local‑storage persistence for accounts (frontend)
- Supabase integration scaffolding
- JWT‑based backend with cookies
- Simple REST API for user management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Vite, React, TypeScript, Tailwind CSS, shadcn‑ui, Radix UI, React Router, React Query, Supabase JS, Leaflet, Recharts |
| Backend | Node.js, Express, MongoDB (Mongoose), bcrypt, JWT, dotenv, cors, cookie-parser |
| Dev Tools | ESLint, nodemon, TypeScript, GitHub Codespaces compatible |

---

## 📁 Project Structure
```
Nexus-E3/
├── backend/            # Express API & auth logic
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── Campus-commute/     # Frontend PWA
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── integrations/  # supabase client
│       ├── lib/
│       └── pages/
└── LICENSE
```

---

## 🧩 Installation

1. **Clone repository**
```bash
git clone https://github.com/nexushuborg/Nexus-E3.git
cd Nexus-E3
```

2. **Backend setup**
```bash
cd backend
npm install
cp example.env .env       # fill in values
npm start                 # or node server.js
```

3. **Frontend setup**
```bash
cd ../Campus-commute
npm install
# create .env file with values (see below)
npm run dev
```

---

## 📝 Environment Variables

**backend/.env**
```
BACKEND_PORT=5000
MONGODB_URI="your-mongodb-uri"
JWT_SECRET=supersecret
FRONTEND_URL=http://localhost:5173
GMAIL_APP_PASSWORD=optional
```

**Campus-commute/.env**
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

---

## 📦 Usage

- Register as a student or driver via the PWA.
- Login to access role-specific pages (Home, Driver Dashboard, Admin Panel).
- Students can choose routes and view bus positions.
- Drivers can view assigned buses and update status (stub).
- Admins can manage users and routes (UI placeholder).

The backend supports simple `/user` routes for register/login/logout; expand as needed.

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/` | Health check |
| POST   | `/user/register` | Register new user |
| POST   | `/user/login` | Login, returns JWT cookie |
| POST   | `/user/logout` | Clear auth cookie |

---

## 🖼️ Screenshots
Add screenshots below or replace the placeholders with actual images.

![Home](./screenshots/home.png)
![Driver](./screenshots/driver.png)

---

## 🚀 Deployment

1. Build frontend (`npm run build` in Campus-commute) and host on Vercel/Netlify/static server.
2. Deploy backend to Node‑capable host; configure environment variables.
3. (Optional) Set up Supabase tables for full realtime features and update `.env`.

---

## 🔮 Future Improvements

- Full backend integration and database persistence for users/routes
- Real GPS tracking
- Push notifications and email verification
- Payment gateway, chat support, trip history, ratings
- Unit tests, CI/CD, production hardening

---

## 📜 License
Licensed under the **MIT License** – see the root [LICENSE](../LICENSE) file.

---

*(This README covers both the frontend and backend of Campus Commute for developers and contributors.)*
