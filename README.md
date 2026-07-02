# 🅿️ Smart Parking System

A comprehensive, modern full-stack web application designed to manage, track, and book parking slots in real time. It features a responsive React-based frontend with an elegant glassmorphism UI, interactive multi-floor parking map selection, secure mock payments, and a fully featured Admin Dashboard.

---

## 🚀 Key Features

*   🔐 **Secure Authentication**: JWT-based registration and login with roles (`user` & `admin`).
*   🗺️ **Interactive Parking Map**: Real-time visualization of slot status (Available vs Occupied) across **Ground Floor**, **First Floor**, and **Second Floor**.
*   ⚡ **Instant Booking**: Real-time slot reservation with auto-calculated rates.
*   💳 **Secure Mock Payment Gateway**: Integrated simulated payment system supporting Card and UPI transactions.
*   📄 **Booking Receipts**: Instant invoice generation with check-in timestamps, pricing breakdown, and transaction IDs.
*   📊 **Admin Dashboard**:
    *   Full administrative dashboard showing database statistics (total active bookings, available slots).
    *   Modify slot status, add slots, reset occupancy, and adjust pricing.
    *   View all transactions and historical booking records.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (bootstrapped with [Vite](https://vite.dev/))
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
*   **Styling**: Glassmorphism using Custom CSS / Theme Variables
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose ODM](https://mongoosejs.com/))
*   **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing

---

## 📁 Project Structure

```text
Smart_Parking/
├── backend/                  # Node/Express API Server
│   ├── controllers/          # API Route controllers
│   ├── middleware/           # JWT verification & authorization
│   ├── models/               # MongoDB / Mongoose models (User, Slot, Booking)
│   ├── routes/               # Express API endpoints
│   ├── server.js             # Entry point of the Express server
│   ├── seeder.js             # Database seeding script (A1-A10, B1-B10 slots + test users)
│   └── add_second_floor.js   # Script to append second floor slots (S1-S10)
│
├── frontend/                 # React Single Page Application (SPA)
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, ParkingMap, Modals, etc.)
│   │   ├── context/          # React AuthContext for state preservation
│   │   ├── pages/            # View pages (Home, Login, Dashboard, Payment, Admin)
│   │   ├── App.jsx           # Main Router configuration
│   │   └── index.css         # Styling system & dark theme variables
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) installed (v18+)
*   [MongoDB](https://www.mongodb.com/) server running locally (default: `mongodb://localhost:27017`)

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database to create default slots and test accounts:
   ```bash
   node seeder.js
   node add_second_floor.js
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start running on [http://localhost:5000](http://localhost:5000).*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open on [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Test Credentials

Use these seeded credentials to test the features of the application immediately:

### 👤 User Account (Standard Booker)
*   **Email**: `user1@park.com`
*   **Password**: `user123`

### 🛡️ Admin Account (Dashboard Controller)
*   **Email**: `admin@park.com`
*   **Password**: `admin123`
