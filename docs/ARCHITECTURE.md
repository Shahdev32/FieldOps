# FieldOps - Architecture Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Tech Stack Justification](#tech-stack-justification)
4. [Database Design](#database-design)
5. [Authentication Strategy](#authentication-strategy)
6. [API Design](#api-design)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Considerations](#security-considerations)
9. [Scalability Considerations](#scalability-considerations)
10. [What I Chose NOT to Build](#what-i-chose-not-to-build)

## System Overview

FieldOps is a three-tier web application following a traditional REST API architecture:

```
┌─────────────────┐
│  React Frontend │  (Port 3000)
│  (SPA)          │
└────────┬────────┘
         │ HTTP/JSON
         │ JWT Auth
         ▼
┌─────────────────┐
│  Express API    │  (Port 5000)
│  (REST)         │
└────────┬────────┘
         │ Mongoose ODM
         ▼
┌─────────────────┐
│    MongoDB      │  (Port 27017)
│  (Database)     │
└─────────────────┘
```

### Component Responsibilities

**Frontend (React)**
- User interface and interaction
- Client-side routing
- JWT token management
- API communication via Axios
- Role-based view rendering

**Backend (Express)**
- RESTful API endpoints
- Business logic
- Authentication & authorization
- Data validation
- Database operations via Mongoose

**Database (MongoDB)**
- Persistent data storage
- Indexing for query optimization
- Schema validation

## Architecture Diagram

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (Client)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Login Page   │  │Admin Dashboard│  │  Components  │   │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘   │
│         │                 │                   │            │
│         └─────────────────┴───────────────────┘            │
│                           │                                │
│                  ┌────────▼────────┐                       │
│                  │  Auth Context   │                       │
│                  │  (State Mgmt)   │                       │
│                  └────────┬────────┘                       │
│                           │                                │
│                  ┌────────▼────────┐                       │
│                  │   API Service   │                       │
│                  │    (Axios)      │                       │
│                  └────────┬────────┘                       │
└───────────────────────────┼────────────────────────────────┘
                            │ HTTPS
                            │ JWT in Authorization Header
┌───────────────────────────▼────────────────────────────────┐
│                   Express.js Server                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Middleware                         │  │
│  │  • CORS  • Body Parser  • JWT Verification           │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                    Routes                             │  │
│  │  • /api/auth  • /api/users  • /api/jobs              │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                  Controllers                          │  │
│  │  • authController  • userController  • jobController │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                  Models (Mongoose)                    │  │
│  │  • User  • Job  • JobNote                            │  │
│  └────────────────────┬─────────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────────┘
                        │ MongoDB Driver
┌───────────────────────▼─────────────────────────────────────┐
│                      MongoDB                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   users    │  │    jobs    │  │  jobnotes  │            │
│  │ collection │  │ collection │  │ collection │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

### Request Flow Example: Create Job

```
1. Admin fills form → clicks "Create Job"
                ↓
2. React sends POST /api/jobs with JWT token
                ↓
3. Express middleware verifies JWT
                ↓
4. Auth middleware checks user role (admin)
                ↓
5. Controller validates input
                ↓
6. Controller checks client/technician exist
                ↓
7. Mongoose creates Job document
                ↓
8. Mongoose creates JobNote document
                ↓
9. Notification logged to console
                ↓
10. Response sent back to frontend
                ↓
11. React updates UI with new job
```

## Tech Stack Justification

### Backend: Node.js + Express

**Chosen because:**
- **Full-stack JavaScript**: Single language across frontend and backend reduces context switching
- **Fast development**: Express is minimal and unopinionated, allowing rapid prototyping
- **Large ecosystem**: npm has packages for everything we need (JWT, validation, etc.)
- **Non-blocking I/O**: Good for handling multiple concurrent requests (field techs checking in)
- **Familiarity**: I have experience with it, reducing development time

**Alternatives considered:**
- **Python/Django**: More "batteries included" but slower development for a small API
- **Go**: Better performance but steeper learning curve for this timeline
- **Java/Spring Boot**: Overkill for this scale, more boilerplate

### Database: MongoDB

**Chosen because:**
- **Schema flexibility**: Requirements were intentionally vague; MongoDB allows iteration
- **Easy local setup**: No complex installation, just run `mongod`
- **Document model**: Jobs with nested notes/updates fit naturally in documents
- **Mongoose ODM**: Provides structure and validation while maintaining flexibility
- **No migrations**: For rapid prototyping, avoiding migration complexity was valuable

**Alternatives considered:**
- **PostgreSQL**: Better for relational data, but adds migration complexity
- **SQLite**: Simpler setup but limited for production scaling
- **MySQL**: Similar to PostgreSQL but less feature-rich

**Trade-off accepted**: Less strict data integrity vs. development speed

### Frontend: React

**Chosen because:**
- **Component-based**: UI is naturally divided into reusable pieces (JobList, Navbar, etc.)
- **Virtual DOM**: Efficient updates when job lists change
- **Large ecosystem**: React Router, context API, hooks all work well together
- **State management**: Context API sufficient for this app size
- **Familiarity**: Most widely used, good for collaboration

**Alternatives considered:**
- **Vue.js**: Easier learning curve but smaller ecosystem
- **Svelte**: Better performance but less mature tooling
- **Next.js**: Overkill for this SPA, SSR not needed

### Authentication: JWT

**Chosen because:**
- **Stateless**: Server doesn't need to store sessions, easier to scale horizontally
- **Simple**: Easy to implement and understand
- **Standard**: Works well with REST APIs
- **Mobile-ready**: Can be used by mobile apps in the future

**Alternatives considered:**
- **Session-based**: Would require Redis/session store, added complexity
- **OAuth2**: Too complex for internal tool with invite-based registration

**Trade-off accepted**: No built-in token revocation (would need blacklist in production)

## Database Design

### Schema Design Rationale

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: admin/technician/client),
  phone: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Design decisions:**
- **Single users collection**: All roles in one collection (vs. separate collections)
  - **Why**: Reduces joins, simpler queries, roles share most fields
  - **Trade-off**: Some fields might not apply to all roles
- **Email as unique identifier**: Natural primary key for login
- **isActive flag**: Soft deletes preserve data integrity
- **Password field**: Never returned in queries (Mongoose `select: false`)

#### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: pending/assigned/in_progress/completed/cancelled),
  client: ObjectId (ref: User),
  technician: ObjectId (ref: User, nullable),
  scheduledDate: Date (nullable),
  location: String,
  priority: String (enum: low/medium/high/urgent),
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Design decisions:**
- **References vs. Embedding**: Client/technician stored as references (normalized)
  - **Why**: Users are updated independently, avoiding data duplication
  - **Trade-off**: Requires population (extra query) but keeps data consistent
- **Status enum**: Prevents invalid status values
- **Nullable technician**: Jobs can exist without assignment
- **Soft deletes**: Preserves job history for reporting

**Indexes:**
```javascript
{ client: 1, status: 1 }     // Client dashboard queries
{ technician: 1, status: 1 } // Technician dashboard queries
{ isDeleted: 1 }             // Exclude deleted jobs
```

#### JobNotes Collection
```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job),
  user: ObjectId (ref: User),
  note: String,
  noteType: String (enum: comment/status_change/assignment/general),
  createdAt: Date,
  updatedAt: Date
}
```

**Design decisions:**
- **Separate collection vs. embedded**: Chose separate collection
  - **Why**: Notes can grow unbounded, would bloat job documents
  - **Why**: Easier to query/filter notes independently
  - **Trade-off**: Extra query to fetch notes, but more flexible
- **noteType field**: Allows filtering by activity type (status changes vs. comments)

**Index:**
```javascript
{ job: 1, createdAt: -1 }  // Get notes for a job, newest first
```

### Relationships

```
User (1) ──< (N) Job (as client)
User (1) ──< (N) Job (as technician)
Job (1) ──< (N) JobNote
User (1) ──< (N) JobNote
```

### Data Integrity Mechanisms

1. **Mongoose Schema Validation**
   - Required fields enforced
   - Enum validation for status/role/priority
   - Email format validation via regex

2. **Pre-save Hooks**
   - Password hashing before save
   - Automatic timestamp updates

3. **Soft Deletes**
   - Jobs: `isDeleted: true`
   - Users: `isActive: false`
   - Why: Preserve referential integrity, enable data recovery

4. **Population**
   - Related data fetched when needed
   - Prevents orphaned references

### What Could Go Wrong & How We Handle It

| Scenario | Handling |
|----------|----------|
| User deleted but has jobs | Soft delete keeps reference valid |
| Technician assigned but unavailable | Admin can reassign (no constraints) |
| Job deleted with notes | Soft delete preserves notes |
| Duplicate emails | Unique index + error handling |
| Invalid status transition | Not enforced (business decision: flexibility) |
| Concurrent updates | MongoDB atomic updates, last-write-wins |

## Authentication Strategy

### Flow Diagram

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└─────┬────┘                                    └─────┬────┘
      │                                               │
      │  POST /api/auth/login                         │
      │  { email, password }                          │
      │ ─────────────────────────────────────────────>│
      │                                               │
      │                               Check password  │
      │                              Generate JWT ◄───┤
      │                                               │
      │  { token, userData }                          │
      │ <─────────────────────────────────────────────│
      │                                               │
      │  Store token in localStorage                  │
      │                                               │
      │                                               │
      │  GET /api/jobs                                │
      │  Authorization: Bearer <token>                │
      │ ─────────────────────────────────────────────>│
      │                                               │
      │                               Verify JWT  ◄───┤
      │                               Decode user ID  │
      │                               Fetch user      │
      │                               Check role      │
      │                                               │
      │  { jobs: [...] }                              │
      │ <─────────────────────────────────────────────│
      │                                               │
```

### JWT Token Structure

```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: "user_id_from_mongodb",
    iat: 1234567890,  // Issued at
    exp: 1234654290   // Expires (24h later)
  },
  signature: "..."
}
```

### Authentication Flow Details

1. **Login**
   - User submits email + password
   - Server finds user, compares hashed password (bcrypt)
   - If valid, generates JWT with user ID
   - Returns token + user data (without password)
   - Frontend stores token in localStorage

2. **Authenticated Requests**
   - Frontend includes `Authorization: Bearer <token>` header
   - Backend middleware extracts token
   - Verifies signature using JWT_SECRET
   - Decodes user ID from payload
   - Fetches full user object from database
   - Attaches user to `req.user` for controllers

3. **Authorization**
   - After authentication, check `req.user.role`
   - `authorize('admin')` middleware rejects non-admins
   - Controllers can check specific permissions

4. **Logout**
   - Frontend removes token from localStorage
   - No server-side state to clear (stateless JWT)

### Security Measures

| Security Concern | Mitigation |
|-----------------|------------|
| Password storage | bcrypt with salt (10 rounds) |
| Token expiry | 24-hour expiration |
| Token theft | HTTPS only (in production) |
| XSS attacks | No inline scripts, sanitize inputs |
| CSRF | Not applicable (no cookies, using Bearer tokens) |
| Brute force | Not implemented (would add rate limiting) |
| Token revocation | Not implemented (would need blacklist) |

### What's NOT Implemented (But Should Be in Production)

- **Refresh tokens**: Long-lived refresh + short access token
- **Token blacklist**: Revoke tokens on logout/password change
- **Rate limiting**: Prevent brute force login attempts
- **Password strength requirements**: Only minLength: 6 enforced
- **2FA**: Additional security layer
- **Account lockout**: After N failed attempts
- **Password reset flow**: Forgot password functionality

## API Design

### RESTful Principles

Following REST conventions:
- **Resources**: Users, Jobs, JobNotes
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- **JSON**: All request/response bodies in JSON

### Endpoint Structure

```
/api/auth/*       → Authentication (login, register)
/api/users/*      → User management
/api/jobs/*       → Job management
/api/jobs/:id/notes → Nested resource (notes belong to jobs)
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "count": 5  // For list endpoints
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Role-Based Access Control

Implemented via middleware:
```javascript
router.post('/jobs', protect, authorize('admin'), createJob);
//                   ↑         ↑
//          Requires auth   Requires admin role
```

**Protection levels:**
1. **Public**: No authentication (only /login)
2. **Protected**: Any authenticated user (GET /users/:id)
3. **Admin-only**: Admin role required (POST /jobs)
4. **Conditional**: Role-based logic in controller (PUT /jobs/:id)

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public Route)
│       └── AdminDashboard (Protected Route)
│           ├── Navbar
│           ├── Stats Cards
│           ├── Filter Section
│           ├── JobList
│           │   └── JobCard (multiple)
│           └── CreateJobForm (Modal)
```

### State Management

**Global State (Context API):**
- User authentication state
- Login/logout functions
- Loading state

**Local Component State:**
- Form inputs
- Jobs list
- Stats data
- UI state (modals, filters)

**Why not Redux?**
- App is small enough for Context API
- Reduces complexity and bundle size
- Context API + hooks sufficient for this use case

### Data Flow

```
1. User Action (e.g., click "Create Job")
        ↓
2. Component handler function
        ↓
3. API service call (axios)
        ↓
4. Backend processes request
        ↓
5. Response received
        ↓
6. Update component state
        ↓
7. React re-renders UI
```

### API Service Pattern

Centralized API calls in `services/api.js`:
- Single axios instance with baseURL
- Request interceptor adds JWT token
- Response interceptor handles 401 (auto-logout)
- Organized by resource (authAPI, usersAPI, jobsAPI)

**Benefits:**
- DRY (Don't Repeat Yourself)
- Consistent error handling
- Easy to add global interceptors (logging, retry logic)

### Routing Strategy

**React Router v6:**
- `<BrowserRouter>`: HTML5 history API
- `<Routes>` + `<Route>`: Declarative routing
- `<Navigate>`: Programmatic redirects

**Route Protection:**
```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```
Checks authentication, redirects to /login if not authenticated.

## Security Considerations

### Current Implementation

1. **Authentication**
   - ✅ JWT-based auth
   - ✅ Password hashing (bcrypt)
   - ✅ Token verification on every request
   - ✅ Role-based access control

2. **Input Validation**
   - ✅ Mongoose schema validation
   - ✅ Email format validation
   - ✅ Required field enforcement
   - ⚠️ Basic sanitization (not comprehensive)

3. **Data Protection**
   - ✅ Passwords never returned in responses
   - ✅ Soft deletes preserve data
   - ⚠️ No field-level encryption

4. **API Security**
   - ✅ CORS configured for frontend origin
   - ❌ No rate limiting
   - ❌ No request size limits (beyond Express defaults)

### What's Missing (Production Requirements)

1. **Input Sanitization**
   - XSS protection (sanitize HTML)
   - SQL/NoSQL injection prevention (using Mongoose helps)
   - File upload validation (not implemented)

2. **Rate Limiting**
   - Login attempts: 5 per 15 minutes
   - API calls: 100 per hour per IP
   - Would use `express-rate-limit` package

3. **HTTPS**
   - Currently HTTP for local development
   - Production requires SSL/TLS certificates

4. **Environment Variables**
   - Currently `.env` file (not in git)
   - Production should use secret management (AWS Secrets Manager, etc.)

5. **Security Headers**
   - Helmet.js for setting security headers
   - CSP (Content Security Policy)
   - HSTS (HTTP Strict Transport Security)

6. **Audit Logging**
   - Log all admin actions
   - Track who changed what and when

7. **Data Encryption**
   - Encrypt sensitive fields at rest
   - Hash/encrypt PII (phone numbers, addresses)

### Security Checklist for Production

- [ ] Add rate limiting
- [ ] Implement input sanitization
- [ ] Set up HTTPS
- [ ] Add Helmet.js security headers
- [ ] Implement audit logging
- [ ] Add password complexity requirements
- [ ] Implement account lockout after failed attempts
- [ ] Add CAPTCHA on login
- [ ] Set up monitoring/alerting for suspicious activity
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

## Scalability Considerations

### Current State (Single Server)

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│ Browser │────▶│ Express │────▶│ MongoDB  │
└─────────┘     └─────────┘     └──────────┘
```

**Limitations:**
- Single point of failure
- Limited concurrent users (~1000-5000 with Node.js)
- Database on same machine as API

### Scalability Strategy (If Needed)

#### Phase 1: Vertical Scaling (Easiest)
- Increase server resources (CPU, RAM)
- Add database indexes (already implemented)
- Enable MongoDB query caching
- Optimize queries (select only needed fields)

**Cost**: Low → **Impact**: Moderate

#### Phase 2: Horizontal Scaling (Load Balancing)

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼───┐         ┌────▼────┐       ┌────▼────┐
    │Express│         │ Express │       │ Express │
    │Server1│         │ Server2 │       │ Server3 │
    └───┬───┘         └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                      ┌────▼─────┐
                      │ MongoDB  │
                      │ Replica  │
                      │   Set    │
                      └──────────┘
```

**Changes needed:**
- Stateless authentication (✅ already using JWT)
- MongoDB replica set for high availability
- Redis for shared session data (if needed)
- Nginx/HAProxy load balancer

**Cost**: Moderate → **Impact**: High

#### Phase 3: Microservices (Overkill for This App)

Only if truly necessary:
- Separate services: auth-service, job-service, notification-service
- Message queue (RabbitMQ/Redis) for async communication
- API Gateway (Kong/AWS API Gateway)

**Cost**: High → **Impact**: Very High (but complex)

### Database Scalability

**Current indexes:**
```javascript
// Users
{ email: 1 } // Unique, for login

// Jobs
{ client: 1, status: 1 }     // Client queries
{ technician: 1, status: 1 } // Technician queries
{ isDeleted: 1 }             // Filter deleted

// JobNotes
{ job: 1, createdAt: -1 }   // Get notes for job
```

**If scaling needed:**
- Add composite indexes for common queries
- MongoDB sharding (partition data across servers)
- Read replicas for read-heavy workloads
- Caching layer (Redis) for frequent queries

### Performance Optimizations (Not Implemented)

1. **Pagination**
   ```javascript
   GET /api/jobs?page=1&limit=20
   ```

2. **Field Selection**
   ```javascript
   GET /api/jobs?fields=title,status,client
   ```

3. **Caching**
   - Cache stats endpoint (changes infrequently)
   - ETags for conditional requests
   - Redis cache for user sessions

4. **Database Connection Pooling**
   - Mongoose default pool size: 5
   - Increase for production: 20-50

5. **CDN for Frontend**
   - Serve static React build from CDN
   - Reduce server load

### Estimated Capacity (Back-of-Envelope)

**Single server (2 CPU, 4GB RAM):**
- Concurrent users: ~1000
- Jobs created per day: ~5000
- API requests per second: ~100

**With load balancing (3 servers):**
- Concurrent users: ~3000
- Jobs created per day: ~15000
- API requests per second: ~300

**Bottlenecks:**
1. Database queries (mitigated by indexes)
2. JWT verification (CPU-bound, fast though)
3. API response time (<100ms currently)

## What I Chose NOT to Build

### 1. Email Notification System

**Why not:**
- Adds infrastructure complexity (SMTP server, email service)
- Requires testing/handling bounces/spam
- Not core to business logic demonstration

**What I did instead:**
- Console logging as proof-of-concept
- Clear notification triggers in code
- Easy to swap for real email service

**Production path:**
- Use SendGrid/AWS SES/Mailgun
- Template system (Handlebars/Pug)
- Queue system for async sending

### 2. Background Job Processing

**Why not:**
- Requires job queue infrastructure (Redis/RabbitMQ)
- No true async requirements in current scope
- Notifications are logged synchronously (acceptable for now)

**What I did instead:**
- Synchronous operations (fast enough for current scale)
- Could add later with BullMQ/pg-boss

**Production path:**
```javascript
// Example with BullMQ
const notificationQueue = new Queue('notifications', { 
  connection: redisConnection 
});

notificationQueue.add('send-email', {
  to: client.email,
  subject: 'Job Assigned',
  body: `Job ${job.title} has been assigned.`
});
```

### 3. Fine-Grained Permissions System

**Why not:**
- Three roles (admin/tech/client) cover the requirements
- RBAC complexity not needed for this scope
- Permissions are clear and binary

**What I did instead:**
- Simple role enum in User model
- Middleware-based authorization
- Controller-level permission checks

**Production path:**
- Permissions table (e.g., "can_assign_jobs", "can_delete_jobs")
- User-Permission many-to-many relationship
- Permission checking library (CASL/Accesscontrol)

### 4. Real-Time Updates (WebSockets)

**Why not:**
- Polling/manual refresh acceptable for MVP
- WebSocket infrastructure adds complexity
- Not requested in requirements

**What I did instead:**
- Manual refresh on job list
- Optimistic UI updates after actions

**Production path:**
- Socket.io for real-time job updates
- Subscribe to job changes by ID
- Push notifications to online users

### 5. Advanced Search & Filtering

**Why not:**
- Simple status filter sufficient for demo
- Full-text search requires indexes/infrastructure
- Time constraint

**What I did instead:**
- Client-side filter by status
- MongoDB queries filter by role

**Production path:**
- MongoDB text indexes
- ElasticSearch for complex queries
- Faceted search (filter by multiple criteria)

### 6. Automated Testing

**Why not:**
- Time constraint (6-10 hours)
- Prioritized working features over tests
- Manual testing sufficient for demo

**What I did instead:**
- Manual testing of all flows
- Seed script creates test data
- Error handling in place

**Production path:**
- Jest for unit tests
- Supertest for API integration tests
- React Testing Library for frontend
- Cypress for E2E tests

### 7. Client & Technician Portals

**Why not:**
- Admin flow demonstrates all core functionality
- Time better spent on quality over quantity
- Same backend APIs would power all portals

**What I did instead:**
- Built admin dashboard as example
- Role-based API filtering in place
- Easy to add separate routes/views

**Production path:**
```javascript
// Different routes for different roles
/admin/dashboard    → Admin view
/tech/jobs          → Technician view  
/client/jobs        → Client view
```

All would use same API, just different UI/filters.

---

## Conclusion

This architecture prioritizes:
1. **Simplicity** - Easy to understand and maintain
2. **Flexibility** - MongoDB and React allow rapid iteration
3. **Security** - JWT auth, RBAC, input validation
4. **Scalability** - Stateless design enables horizontal scaling
5. **Pragmatism** - Production-ready features vs. over-engineering

The system is **production-ready with enhancements** (see security/scalability sections), not a toy project, but also not over-engineered for the current scope.
