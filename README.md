# FieldOps - Field Service Management Platform

A simplified field service management platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

##  Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [What's Missing](#whats-missing)

##  Overview

FieldOps is an internal platform designed to help small companies manage field technicians who perform service jobs at client sites. The platform supports three user roles:
- **Admin** - manages the platform, creates jobs, assigns technicians
- **Technician** - views assigned jobs, updates job status
- **Client** - views their own jobs

##  Features

### Implemented (Core Features)
-  **Authentication** - JWT-based auth with role-based access control
-  **Job Management** - Create, view, update, and soft-delete jobs
-  **Job Assignment** - Assign technicians to jobs
-  **Status Tracking** - Track job progress through multiple states
-  **Admin Dashboard** - Overview of jobs and statistics
-  **Role-based Permissions** - Different capabilities for each role
-  **Job Notes/Activity** - Add notes and track changes
-  **Notifications** - Console-based notification system (proof of concept)

### Not Implemented (Bonus Features)
-  Docker setup
-  Background job processing
-  Fine-grained RBAC beyond basic roles
-  Audit log
-  Pagination & filtering on API
-  Rate limiting
-  Email notifications
-  Client portal (separate view)
-  Technician portal

##  Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Database** | MongoDB | Flexible schema, easy local setup, good for rapid prototyping |
| **Backend** | Node.js + Express | Fast development, large ecosystem, JavaScript full-stack |
| **Frontend** | React | Component-based, efficient updates, familiar ecosystem |
| **Authentication** | JWT | Stateless, simple to implement, works well for this use case |
| **Validation** | Mongoose schemas | Built-in validation, type safety at DB level |

##  Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fieldops
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp  .env

# Edit .env with your settings (or use defaults)
# Make sure MongoDB is running on your system

# Seed the database with test data
node seed.js

# Start the backend server
node server.js 
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

##  Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fieldops
JWT_SECRET=supersecret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB
```bash
# On macOS/Linux
mongod

# On Windows
# MongoDB usually runs as a service, if not:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

### Start Backend (Terminal 1)
```bash
cd backend
node server.js
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

### Access the Application
Open your browser and navigate to `http://localhost:3000`

##  Test Credentials

The seed script creates the following test users:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | 123456 |
| **Technician** | tech@test.com | 123456 |



##  Assumptions & Design Decisions

### User Management
- **Registration is invite-based**: Only admins can create user accounts
- **All roles use the same login flow**: Email + password authentication


### Job Management
- **Who can create jobs**: Only admins (business decision: clients request via phone/email)
- **Job statuses**: `pending → assigned → in_progress → completed` (or `cancelled`)
- **Assignment rules**: 
  - Jobs start as "pending" if no technician assigned
  - Automatically become "assigned" when technician is added
  - Only assigned technician can update their own job status
- **Reassignment**: Admins can reassign jobs at any time

### Permissions Matrix

| Action | Admin | Technician | Client |
|--------|-------|------------|--------|
| Create Job | ✅ | ❌ | ❌ |
| Assign Job | ✅ | ❌ | ❌ |
| View All Jobs | ✅ | Own only | Own only |
| Update Status | ✅ | Own jobs | ❌ |
| Delete Job | ✅ | ❌ | ❌ |
| Add Notes | ✅ | Own jobs | Own jobs |




##  What's Missing

### Not Implemented (But Planned)
1. **Technician Portal**: Separate view for techs to see their jobs, update status
2. **Client Portal**: Separate view for clients to see their jobs
3. **Email Notifications**: Real email integration
4. **Advanced Filtering**: Filter jobs by date range, priority, location
5. **Search Functionality**: Search jobs by title, description
6. **Pagination**: For job lists
7. **Job History Timeline**: Visual timeline of status changes
8. **User Profile Management**: Users can update their own profile
9. **Password Reset Flow**: Forgot password functionality
10. **Docker Setup**: Containerization for easy deployment

---

**Note**: This is a demonstration project built for a technical assessment. It is not production-ready and should not be deployed without significant security enhancements and testing.
