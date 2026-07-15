# 🚀 Campus Rental System

A full-stack **Campus Item Rental Platform** where users can list items, book rentals, and make payments with admin verification.

---

## 🌐 Live Demo

*(Add after deployment)*
Frontend: https://your-frontend-url
Backend: https://your-backend-url

---

## 📌 Features

### 👤 Authentication

* User signup & login (JWT-based)
* Protected routes
* Role-based access (User / Admin)

---

### 🛍️ Item Listings

* Users can list items for rent
* Upload **multiple images**
* Edit & delete listings
* View all available items

---

### 📅 Booking System

* Select rental dates
* Prevents overlapping bookings
* Automatic price calculation
* Booking status management

---

### 💳 Payment System

* Screenshot-based payment submission
* File upload with validation (Multer)
* Admin verification (confirm/reject)
* Booking status updates on confirmation

---

### 🛠️ Admin Dashboard

* View users, items, bookings, payments
* Confirm / reject payments
* Delete items
* Screenshot preview with modal + zoom

---

### 🎨 UI/UX

* Modern responsive UI (Tailwind CSS)
* Card-based layout
* Image galleries with preview & zoom
* Clean dashboard experience

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose

### Other Tools

* Multer (file uploads)
* JWT Authentication
* Zod Validation

---

## 📁 Project Structure

```
campus-rental-system/
├── backend/
│   ├── src/
│   ├── routes/
│   ├── services/
│   └── models/
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/campus-rental-system.git
cd campus-rental-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Required `.env`

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### Required `.env`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📂 File Uploads

* Stored locally in:

```
backend/uploads/
```

* Ignored in Git for security and performance

---

## 🔐 Security Features

* JWT authentication
* Protected API routes
* Input validation with Zod
* File type & size validation
* Role-based authorization

---

## 🚧 Future Improvements

* Cloud storage (Cloudinary)
* Razorpay payment integration
* Real-time booking availability
* Search & filters
* Pagination
* Notifications system

---

## 🎯 Use Cases

* College rental marketplace
* Peer-to-peer item sharing
* MVP for rental startups

---

## 👨‍💻 Author

**Sagnik Majumder**

* Computer Science Student
* Full Stack Developer

---

## ⭐ Acknowledgements

* Built as a full-stack learning + production-ready project
* UI enhanced using modern design principles

---

## 📜 License

This project is open-source and available for learning and development purposes.

---
