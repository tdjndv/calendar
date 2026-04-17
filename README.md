# 📅 Calendar Notes

A full-stack calendar-based note management application that allows users to create, edit, and organize notes by date. Built with modern frontend state management and a RESTful backend, focusing on clean architecture, responsive UI, and efficient data synchronization.

---

## 🌟 What Makes This Project Strong

* 🧠 Demonstrates **clear separation of UI state vs server state** (Redux + TanStack Query)
* ⚡ Implements **real-time UI updates via cache invalidation**, no manual state syncing
* 🗂️ Combines **calendar visualization + CRUD data management**
* 🧱 Built with a **modern full-stack architecture** (React + Django + PostgreSQL)
* 🎯 Focused on **clean UX, interaction design, and maintainable code structure**

---

## 🚀 Key Features

* 📅 Interactive calendar with dynamic month navigation
* 📝 Create, edit, and delete notes for any day
* 🔵 Visual indicators showing number of notes per day
* ⚡ Instant UI updates after mutations (no refresh needed)
* 🔍 Filter notes by date and month via backend API
* 📦 Scrollable note panel for better UX with large datasets
* 🎨 Clean, responsive UI built with Tailwind CSS

---

## 🧱 Tech Stack

### Frontend

* React (TypeScript)
* Redux Toolkit (UI state management)
* TanStack Query (server-state management & caching)
* Axios (API communication)
* Tailwind CSS

---

### Backend

* Django
* Django REST Framework (DRF)
* PostgreSQL

---

## 🏗️ System Design Highlights

* 🔄 **Separation of concerns in frontend state**
  * Redux manages UI state (selected date, current month)
  * TanStack Query manages server data (notes)

* ⚡ **Efficient data synchronization**
  * Automatic refetching via query invalidation after mutations
  * Eliminates manual state updates and reduces bugs

* 🧩 **RESTful backend design**
  * DRF `ModelViewSet` provides full CRUD endpoints
  * Query-based filtering (`?date=` and `?month=`)

* 🗃️ **Database design**
  * Notes are indexed by date for efficient querying
  * PostgreSQL used for scalable relational storage

---

## ⚡ Performance & UX

* 🚀 Cached API responses with TanStack Query
* 🔁 Minimal network requests via intelligent invalidation
* 📦 Scrollable note panel prevents layout shifting
* 🎯 Optimized rendering using React hooks and memoization
* 💡 Instant feedback for user actions (create/edit/delete)

---

## 🔌 API Overview

### Notes (`/api/notes`)

* `GET /api/notes/?date=YYYY-MM-DD`  
  → Get notes for a specific day

* `GET /api/notes/?month=YYYY-MM`  
  → Get all notes for a month (used for calendar indicators)

* `POST /api/notes/`  
  → Create a note

* `PATCH /api/notes/:id/`  
  → Update a note

* `DELETE /api/notes/:id/`  
  → Delete a note

---

## ⚔️ Challenges & Solutions

* **Keeping frontend and backend data in sync**  
  → Solved using TanStack Query’s caching + invalidation system

* **Managing different types of state**  
  → Separated UI state (Redux) from server state (Query)

* **Calendar-based data visualization**  
  → Implemented month-level aggregation for note indicators

* **UI scaling with large number of notes**  
  → Introduced scrollable panel with fixed layout

* **Avoiding over-engineering backend**  
  → Leveraged DRF `ModelViewSet` for rapid, clean API development

---

## 🔮 Future Improvements

* 🔐 User authentication and per-user data isolation
* 📱 Mobile-responsive enhancements
* 🏷️ Tags or categories for notes
* 🔍 Search and filtering
* 🧠 AI-assisted note summarization or suggestions
* 🌐 Deployment (Docker + cloud hosting)

---

## 📌 Highlights

This project demonstrates:

* Strong understanding of **modern React architecture**
* Practical use of **Redux + TanStack Query together**
* Clean integration between **frontend and REST API**
* Ability to design **interactive, state-driven UI**
* Solid grasp of **full-stack development fundamentals**

---

## 📄 License

MIT License