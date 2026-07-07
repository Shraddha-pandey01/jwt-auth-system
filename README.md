🔐 JWT Auth System

A backend authentication system built with Node.js and Express.js using JSON Web Tokens (JWT). Covers user registration,
login, and protected route access.

🛠️ Tech Stack

Runtime — Node.js
Framework — Express.js
Auth — JSON Web Token (JWT)
Password Hashing — bcrypt


📁 Project Structure

jwt-auth-system/
├── src/              # DB connection / config
├── routes/           # API route definitions
├── middlewares/      # JWT verification middleware
├── helpers/          # Utility functions (token generation, hashing)
└── server.js         # Entry point


🚀 How It Works

1. User registers → password gets hashed → saved to DB
2. User logs in → credentials verified → JWT token issued
3. For protected routes → token sent in header → middleware verifies it → access granted/denied



📡 API Endpoints

Method    Endpoint               Description                 Auth Required
POST      /api/auth/register      Register a new user             ❌
POST      /api/auth/login        Login and get JWT token          ❌
GET        /api/user/            profileAccess protected route    ✅
