# 🚗 Vehicle Rental System

**Live Demo:** [https://b6-a2-one.vercel.app/](https://b6-a2-one.vercel.app/)

A complete Vehicle Rental Management System that provides secure authentication, efficient vehicle management, intelligent booking logic, and a seamless user experience for both customers and admins.

---

## 🔥 Features

### 🔐 **Authentication & Authorization**

* User registration & login (JWT-based)
* Secure password hashing
* Role-based access (`admin`, `customer`)
* Protected routes with Bearer tokens

### 🚗 **Vehicle Management**

* Admin can add, update, and delete vehicles
* Prevent deletion if active bookings exist
* Public vehicle browsing
* Real-time availability status handling (`available`, `booked`)

### 👥 **User Management**

* Admin can manage all users
* User can update own profile
* Restricts deletion of users with active bookings

### 📅 **Booking System**

* Customer/Admin can create bookings
* Auto total price calculation based on days
* Vehicle status auto-updates when booked/cancelled/returned
* Role-based booking retrieval
* Auto-return logic when rent end date passes

### ⚙️ **Business Logic**

* Booking price = `daily_rent_price × days`
* Vehicle availability updated automatically
* Standardized success & error responses
* Clean, modular backend structure

---

## 🛠️ Technology Stack

### **Backend**

* Node.js
* Express.js
* JWT Authentication
* PostgreSQL / SQL (or NEON DB)
* bcrypt for password hashing

### **Others**

* Vercel Deployment
* REST API Architecture

---

## ⚙️ Setup & Installation

### **1. Clone the Repository**

```bash
git clone <https://github.com/islamemon59/B6A2>
cd <project-folder>
```

### **2. Install Dependencies**

#### Backend

```bash
cd backend
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
DATABASE_URL=<your_database_connection>
JWT_SECRET=<your_secret_key>
```

---

## 🚀 Running the Project

### **Start Backend**

```bash
npm run dev
```

---

## 📌 API Base URL

```
/api/v1
```

## 🙌 Contributing

Pull requests are welcome! Feel free to submit issues or feature suggestions.
