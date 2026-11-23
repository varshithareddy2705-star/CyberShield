# 🛡️ CyberShield

### A Full-Stack Cybersecurity Monitoring & Threat Analysis Dashboard

CyberShield is a web-based cybersecurity dashboard designed to help users analyze website security indicators, monitor scan activity, and manage security incidents through a centralized interface.

Built with a modern full-stack architecture, CyberShield combines an interactive React frontend with a Node.js and Express backend, PostgreSQL database, and authentication system.

---

## ✨ Features

- **Security Dashboard** — A centralized overview of security activity and system information.
- **Website Scanner** — Analyze website URLs using security checks and heuristic-based risk scoring.
- **Scan History** — View previously performed scans and their results.
- **Incident Management** — Track and manage security incidents.
- **User Authentication** — Secure registration and login using JWT authentication.
- **Password Recovery** — Forgot-password and email-based password reset functionality.
- **Analytics** — Visualize security-related information through dashboard analytics.
- **Settings** — Manage user profile and application preferences.

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Email | Nodemailer |
| API Testing | Postman |

---

## 🏗️ Project Structure

```text
CyberShield/
├── backend/
│   ├── lib/
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── routes/
│   └── server.js
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### 1. Clone the repository

```bash
git clone https://github.com/varshithareddy2705-star/CyberShield.git
cd CyberShield
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory.

Configure your own database connection, JWT secret, and SMTP credentials.

### 5. Set up the database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Start the backend

```bash
PORT=5002 node server.js
```

### 7. Start the frontend

Open another terminal:

```bash
cd ~/cybershield
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## 📸 Application Preview

Screenshots of the CyberShield dashboard, scanner, and authentication pages will be added here.

---

## 🔮 Future Improvements

- Integration with real threat-intelligence services.
- Advanced URL reputation and domain analysis.
- Real-time security alerts.
- Enhanced analytics and reporting.
- Production deployment and monitoring.

---

## 👩‍💻 Developer

**C. Varshitha Reddy**

B.Tech — Artificial Intelligence

Mahindra University

[GitHub](https://github.com/varshithareddy2705-star)

---

*CyberShield — Bringing security insights together in one place.*