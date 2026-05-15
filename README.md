#Smart Expense Tracker

> ICA-03 | IT2234 – Web Services and Server Technology
> 2nd Year IT | Node.js · Express.js · MongoDB · React.js

##  Problem Description

University students and young adults often struggle to manage daily expenses. Without proper tracking, overspending goes unnoticed until it's too late. Most students lack a simple, accessible tool tailored to their spending habits (food, transport, entertainment, etc.).

##  Proposed Solution

A full-stack web application that lets users log, categorize, view, and manage their expenses in real time. The backend exposes a RESTful API built with Node.js + Express.js, storing data in MongoDB. A React.js frontend provides a clean, intuitive interface for all CRUD operations.

---

##  Features

- Add, view, edit, and delete expenses
- Organize expenses by custom categories (with color & emoji icon)
- Filter expenses by category or date range
- Visual spending summary with per-category breakdown and progress bars
- Proper error handling and input validation
- Fully tested REST API via Postman

---

##  Technologies Used

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Frontend | React.js (Vite) |
| API Testing | Postman |
| Version Control | Git + GitHub |

---

##  API Endpoints

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/categories` | Create a new category |
| `GET` | `/api/categories` | Get all categories |
| `PUT` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

**Create Category – Request Body:**
```json
{
  "name": "Food",
  "color": "#f59e0b",
  "icon": "🍕"
}
```

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/expenses` | Add a new expense |
| `GET` | `/api/expenses` | Get all expenses (supports `?category=` and `?startDate=&endDate=` filters) |
| `GET` | `/api/expenses/:id` | Get single expense |
| `PUT` | `/api/expenses/:id` | Update an expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |
| `GET` | `/api/expenses/summary` | Aggregated totals by category |

**Create Expense – Request Body:**
```json
{
  "title": "Lunch at canteen",
  "amount": 350,
  "category": "<category_id>",
  "date": "2025-05-01",
  "notes": "Rice and curry"
}
```

---

##  Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local)
- npm

### Backend

```bash
cd backend
npm install
cp .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`  
Backend runs at `http://localhost:5000`

---

##  Project Structure

```
expense-tracker/
├── backend/
│   ├── controllers/
│   │   ├── expenseController.js
│   │   └── categoryController.js
│   ├── models/
│   │   ├── Expense.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── expenses.js
│   │   └── categories.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── postman_collection.json
└── README.md
```

---

##  Postman Testing

Import `postman_collection.json` into Postman.

Set the `base_url` variable to `http://localhost:5000/api`.

After creating a category or expense, copy the returned `_id` into the `category_id` or `expense_id` collection variables to use in subsequent requests.

---

##  Author

A. Fathima Shahnaz 
Reg No: 2022/ICT/141  
IT2234 – Web Services and Server Technology  
2nd Year IT
