# Smart Parking System 🚗💨

A comprehensive, full-stack **MERN (MongoDB, Express, React, Node.js)** web application for real-time parking space monitoring, reservation management, slot allocation, and secure payment processing. 

Designed with a sleek, responsive user interface and robust role-based routing, this platform caters to both everyday commuters (Users) and parking facility managers (Admins).

---

## 🌟 Key Features

### 👤 User Capabilities
- **Live Occupancy Dashboard**: Visually rich dashboard displaying real-time availability of parking spots across multiple floors (Ground, First, Second, etc.).
- **Interactive Floor Map**: Detailed visual parking map detailing slot layouts. Colors change dynamically based on slot status:
  - 🟢 **Available**
  - 🔴 **Occupied** (Currently in use)
  - 🟡 **Reserved** (Booked, awaiting vehicle arrival)
- **Seamless Slot Reservation**: Request bookings by inputting vehicle numbers, selecting the floor, and picking specific slots.
- **Dynamic Checkouts & Receipts**: Automatically calculates the parking fee based on the elapsed duration at exit.
- **Simulation of Payments**: Integrated secure payment interface enabling credit card, UPI, net banking, or debit card transactions.
- **My Bookings History**: Overview of personal current and historical bookings with receipts that can be printed or saved.

### 🔑 Admin Management
- **Dashboard Metrics**: Analytical cards tracking:
  - 💰 Total System Revenue
  - 🚗 Total Parking Slots
  - 📊 Real-time Occupancy Percentage
  - 👥 Total Registered Users
- **Global Bookings Registry**: Complete log of all transactions and active parking bookings.
- **Live Slot Editor**: Ability to dynamically add new parking spots or delete existing ones directly from the admin interface.
- **Active Booking Interventions**: Force-cancel bookings or manually release occupied/reserved spots if needed.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - [React (v19)](https://react.dev/) & [Vite](https://vite.dev/)
  - [React Router DOM (v7)](https://reactrouter.com/) for SPA routing
  - [Axios](https://axios-http.com/) for backend HTTP communication
  - [Lucide React](https://lucide.dev/) for modern icons
  - Vanilla CSS for styling and custom animations
- **Backend**: 
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  - [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for secure authentication
- **Database**: 
  - [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)

---

## 📂 Project Directory Structure

```
Smart_Parking/
├── backend/
│   ├── controllers/      # Route controllers (auth, booking, admin, slot)
│   ├── middleware/       # Authentication guards and error handlers
│   ├── models/           # Mongoose schemas (User, Slot, Booking)
│   ├── routes/           # Express API endpoints
│   ├── seeder.js         # Initial database seeder script
│   ├── server.js         # App entrypoint & DB connection config
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Shared UI components (Navbar, ParkingMap, Modals)
    │   ├── context/      # React Auth Context state management
    │   ├── pages/        # Main route views (Dashboard, Admin, Payment, etc.)
    │   ├── App.jsx       # Route registration
    │   └── main.jsx      # React DOM entrypoint
    └── package.json
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **MongoDB Local Community Server** (running on port `27017`) or a **MongoDB Atlas Cluster**.

---

### 🔧 1. Backend Setup & Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `/backend` folder and populate it with your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/Smart_parking
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Seed the database with mock parking slots and admin/user accounts:
   ```bash
   node seeder.js
   ```
   *Note: This deletes any existing users/slots in the DB and populates 10 slots for the Ground Floor (A1-A10) and 10 slots for the First Floor (B1-B10).*

5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend server should start running at `http://localhost:5000`.

---

### 🎨 2. Frontend Setup & Configuration

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Default Credentials

After running `node seeder.js`, you can test the system immediately with the following accounts:

### 👤 Regular User
- **Email**: `user1@park.com`
- **Password**: `user123`

### 🛡️ System Admin
- **Email**: `admin@park.com`
- **Password**: `admin123`

---

## ⚡ Development & Maintenance Scripts

Inside `/backend`, you will find several helper scripts useful for development tasks:
- `node seeder.js` – Wipes databases and inserts default user, admin, and Ground/First floor spots.
- `node add_first_floor.js` / `node add_second_floor.js` – Manually registers more slots to specific floors.
- `node reset_slots.js` – Resets status of all slots to `available` and cleans active bookings.
- `node update_prices.js` – Adjusts default parking rates globally.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](file:///d:/Smart_Parking/LICENSE) for more details.
