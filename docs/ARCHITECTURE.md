# FieldOps - Architecture 

## 1. System Overview

FieldOps is a **3-tier web application**:

React Frontend → Express API → MongoDB  
(UI) → (Backend) → (Database)

### Responsibilities

**Frontend (React):**
- UI rendering
- Routing
- API requests
- JWT storage

**Backend (Express):**
- REST API handling
- Authentication & authorization
- Business logic

**Database (MongoDB):**
- Stores users, jobs, and job notes

---

## 2. Architecture Flow

### Example: Create Job Flow

1. Admin fills job form
2. Frontend sends API request with JWT token
3. Backend verifies token
4. Checks admin role
5. Saves job in MongoDB
6. Sends response back
7. UI updates

---

## 3. Tech Stack

- **Frontend:** React (SPA)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **API Calls:** Axios

---

## 4. Database Design

### Users Collection
- name
- email (unique)
- password (hashed)
- role (admin / technician / client)
- isActive

### Jobs Collection
- title
- description
- status
- client (User reference)
- technician (User reference)
- priority
- location

### JobNotes Collection
- job (reference)
- user (reference)
- note text
- type
- timestamp

---

## 5. Authentication

### Login Flow

1. User enters email & password
2. Server verifies credentials
3. JWT token is generated
4. Token stored in frontend
5. Token sent with each request

### Role Access

- **Admin:** Create & assign jobs
- **Technician:** Update assigned jobs
- **Client:** View jobs only

---

## 6. API Design

### Routes

- `/api/auth` → Login/Register
- `/api/users` → User management
- `/api/jobs` → Job operations

### Rules

- REST API
- JSON format
- JWT protected routes

---

## 7. Frontend Structure

### Main Parts
- Pages: Login, Dashboard
- Components: Navbar, JobCard, PrivateRoute
- Context API: Auth state

### Data Flow

User Action → API Call → Backend → Response → UI Update

---

## 8. Security (Basic)

### Implemented
- JWT authentication
- Password hashing (bcrypt)
- Role-based access control

### Missing (Production Ready)
- Rate limiting
- HTTPS
- Input sanitization
- Refresh tokens

---

## 9. Scalability

### Current
- Single server architecture

### Future Improvements
- Load balancer
- Multiple backend servers
- MongoDB replica set
- Redis caching

---

## 10. Summary

FieldOps is a simple **job management system** built using:

- React
- Node.js + Express
- MongoDB
- JWT authentication

It is designed to be **simple, scalable, and easy to extend**.
