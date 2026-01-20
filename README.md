# Secure Task Management System

A full-stack task management application with JWT authentication and role-based access control (RBAC), built as an NX monorepo with NestJS backend and Angular frontend.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Access Control (RBAC)](#access-control-rbac)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

## Overview

This project demonstrates a secure, production-ready task management system with:
- **JWT-based authentication** (no mock auth)
- **Role-based access control** (Owner, Admin, Viewer)
- **2-level organization hierarchy** with scoped data access
- **Comprehensive audit logging** for all operations
- **Drag-and-drop Kanban board** UI
- **Modular NX monorepo** architecture with shared libraries

**Built for:** TurboVets Coding Challenge  
**Time Investment:** ~8 hours (timeboxed)  
**Focus:** Security correctness > Feature completeness > UI polish

## Features

### Backend (NestJS + TypeORM + SQLite)
- Real JWT authentication with bcrypt password hashing
- Role-based permission system (action-based: create/read/update/delete)
- Organization hierarchy with parent-child relationships
- Task CRUD with automatic org/role scoping
- Audit logging for all access attempts (allowed + denied)
- RESTful API with proper error handling (401 vs 403)
- TypeORM entities with relationships
- Global validation pipes

### Frontend (Angular + TailwindCSS + CDK)
- Login UI with test credentials displayed
- JWT token storage in localStorage
- HTTP interceptor for automatic token attachment
- Kanban board with 3 status columns (To Do, In Progress, Done)
- Drag-and-drop between columns with automatic status updates
- Create/Edit/Delete task modals
- Filter by category and status
- Sort by order, date created, or title
- Responsive design (mobile to desktop)
- User info display with logout

### Shared Libraries
- `libs/auth`: Reusable RBAC logic (roles, permissions, guards, decorators)
- `libs/data`: Shared TypeScript interfaces (not fully utilized but structured)

## Setup Instructions

### Prerequisites
- Node.js v20+ (LTS recommended)
- npm v10+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jmofa-3d2f7c0c-3b3a-4d5a-9c1a-2a2c3f4a5b6
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `apps/api/.env`:
```env
JWT_SECRET=super-dev-secret-change-in-production
JWT_EXPIRES_IN=3600s
DB_TYPE=sqlite
DB_PATH=./dev.sqlite
```

4. **Seed the database**
```bash
npx ts-node --project apps/api/tsconfig.app.json apps/api/src/seed.ts
```

This creates:
- 2 organizations (parent + child)
- 3 test users with different roles

**Test Credentials:**
- **Owner:** `owner@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`
- **Viewer:** `viewer@example.com` / `password123`

### Running the Application

**Start the API (Terminal 1):**
```bash
npx nx serve api
```
API will be available at: `http://localhost:3000/api`

**Start the Dashboard (Terminal 2):**
```bash
npx nx serve dashboard
```
Frontend will be available at: `http://localhost:4200`

### Building for Production

```bash
# Build API
npx nx build api

# Build Dashboard
npx nx build dashboard
```

## Architecture

### Why NX Monorepo?
- **Shared libraries:** Reuse RBAC logic, DTOs, and types across backend/frontend
- **Clear boundaries:** Apps are independent, libraries define contracts
- **Consistent tooling:** Unified linting, testing, and build processes
- **Scalability:** Easy to add new apps or libraries

### Project Structure
```
jmofa-3d2f7c0c-3b3a-4d5a-9c1a-2a2c3f4a5b6/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── auth/       # JWT authentication
│   │       │   ├── users/      # User management
│   │       │   ├── orgs/       # Organization management
│   │       │   ├── tasks/      # Task CRUD + RBAC
│   │       │   ├── audit/      # Audit logging
│   │       │   └── entities/   # TypeORM entities
│   │       └── seed.ts         # Database seeder
│   └── dashboard/              # Angular frontend
│       └── src/
│           └── app/
│               ├── login/      # Login component
│               ├── tasks/      # Kanban board
│               ├── services/   # Auth & Task services
│               ├── interceptors/ # JWT interceptor
│               └── models/     # TypeScript interfaces
├── libs/
│   ├── auth/                   # Shared RBAC logic
│   │   └── src/lib/
│   │       ├── roles.ts        # Role enum
│   │       ├── permissions.ts  # Permission mappings
│   │       ├── guards/         # RBAC guard
│   │       ├── decorators/     # @RequirePermissions
│   │       └── access-control.service.ts # Org scoping
│   └── data/                   # Shared interfaces (placeholder)
└── README.md
```

### Technology Stack
- **Backend:** NestJS 11, TypeORM, SQLite, JWT, Passport, bcrypt
- **Frontend:** Angular 21, TailwindCSS, Angular CDK (drag/drop)
- **Monorepo:** NX 22
- **Testing:** Jest
- **Validation:** class-validator, class-transformer

## Data Model

### Entities

#### Organization
```typescript
{
  id: UUID
  name: string
  parentOrgId?: UUID  // Nullable for root orgs
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### User
```typescript
{
  id: UUID
  email: string (unique)
  passwordHash: string
  role: 'owner' | 'admin' | 'viewer'
  orgId: UUID
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Task
```typescript
{
  id: UUID
  title: string
  description?: string
  category: string  // 'general' | 'work' | 'personal' | 'urgent'
  status: 'todo' | 'in_progress' | 'done'
  orderIndex: number
  orgId: UUID
  ownerUserId: UUID
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### AuditLog
```typescript
{
  id: UUID
  userId: UUID
  action: string  // e.g., 'task:create', 'task:read'
  resourceType: string  // e.g., 'task', 'audit-log'
  resourceId?: UUID
  allowed: boolean
  reason?: string  // For denied attempts
  timestamp: DateTime
}
```

### Entity Relationships

```
Organization (1) ───< (many) User
Organization (1) ───< (many) Task
Organization (1) ───< (1) Organization (self-referential, parent-child)
User (1) ───< (many) Task (owner)
User (1) ───< (many) AuditLog
```

### ERD Diagram

```
┌─────────────────┐
│  Organization   │
├─────────────────┤
│ id              │◄──┐
│ name            │   │
│ parentOrgId (FK)│───┘ (self-reference)
└─────────────────┘
        │ 1
        │
        ├─────────────────────┐
        │                     │
        │ *                   │ *
┌─────────────────┐   ┌─────────────────┐
│      User       │   │      Task       │
├─────────────────┤   ├─────────────────┤
│ id              │   │ id              │
│ email           │   │ title           │
│ passwordHash    │   │ description     │
│ role            │   │ category        │
│ orgId (FK)      │   │ status          │
└─────────────────┘   │ orderIndex      │
        │ 1           │ orgId (FK)      │
        │             │ ownerUserId (FK)│
        │             └─────────────────┘
        │                     ▲
        └─────────────────────┘
                  * (owner)
```

## Access Control (RBAC)

### Roles & Permissions

| Role   | task:create | task:read | task:update | task:delete | audit-log:read |
|--------|-------------|-----------|-------------|-------------|----------------|
| Viewer | No          | Yes       | No          | No          | No             |
| Admin  | Yes         | Yes       | Yes         | Yes         | Yes            |
| Owner  | Yes         | Yes       | Yes         | Yes         | Yes            |

### Organization Hierarchy Rules

1. **Viewer:**
   - Can only see tasks in their own organization
   - Read-only access

2. **Admin:**
   - Full CRUD on tasks in their organization
   - Can see tasks in child organizations
   - Can view audit logs

3. **Owner:**
   - Same permissions as Admin
   - Intended for top-level organization admins
   - Can view audit logs

### How It Works

**Backend Enforcement (3 layers):**

1. **JWT Guard:** Validates token, extracts user identity
2. **RBAC Guard:** Checks if user has required permissions for the action
3. **Service-level:** Applies organization scoping to queries

**Example Flow:**
```
GET /api/tasks
  ↓
1. JWT Guard: Verify token → Extract { userId, orgId, role }
  ↓
2. RBAC Guard: Check if role has 'task:read' permission
  ↓
3. Service: Query tasks WHERE orgId IN [user.orgId, ...childOrgIds]
  ↓
4. Audit: Log { userId, action: 'task:read', allowed: true }
```

**Frontend:**
- Frontend never assumes permissions
- All authorization decisions made by backend
- UI adapts based on API responses (e.g., 403 errors)

### Audit Logging

Every access attempt (allowed or denied) is logged:

```json
{
  "userId": "32a786c9-...",
  "action": "task:create",
  "resourceType": "task",
  "resourceId": "35cb4256-...",
  "allowed": true,
  "reason": null,
  "timestamp": "2026-01-16T00:46:07.000Z"
}
```

**What's logged:**
- Task creation, reads, updates, deletes
- Audit log access attempts
- Failed permission checks (with reason)

## API Documentation

### Base URL
`http://localhost:3000/api`

### Authentication

#### POST /auth/login
Login and receive JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "32a786c9-c3a9-45e4-9244-370a20b8c122",
    "email": "admin@example.com",
    "role": "admin",
    "orgId": "6c22e1da-6211-4585-89af-8225c4d64671"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### GET /auth/me
Get current authenticated user info.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "32a786c9-...",
  "email": "admin@example.com",
  "orgId": "6c22e1da-...",
  "role": "admin"
}
```

### Tasks

#### POST /tasks
Create a new task (requires `task:create` permission).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Implement feature X",
  "description": "Add new functionality",
  "category": "work",
  "status": "todo"
}
```

**Response (201):**
```json
{
  "id": "35cb4256-...",
  "title": "Implement feature X",
  "description": "Add new functionality",
  "category": "work",
  "status": "todo",
  "orderIndex": 0,
  "orgId": "6c22e1da-...",
  "ownerUserId": "32a786c9-...",
  "createdAt": "2026-01-16T00:46:07.000Z",
  "updatedAt": "2026-01-16T00:46:07.000Z"
}
```

**Error (403):**
```json
{
  "message": "Insufficient permissions. Required: task:create",
  "error": "Forbidden",
  "statusCode": 403
}
```

#### GET /tasks
List all tasks accessible to the user (org-scoped).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "35cb4256-...",
    "title": "Implement feature X",
    "description": "Add new functionality",
    "category": "work",
    "status": "todo",
    "orderIndex": 0,
    "orgId": "6c22e1da-...",
    "ownerUserId": "32a786c9-...",
    "createdAt": "2026-01-16T00:46:07.000Z",
    "updatedAt": "2026-01-16T00:46:07.000Z"
  }
]
```

#### GET /tasks/:id
Get a specific task.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same as single task object above

**Error (404):** Task not found
**Error (403):** Cannot access task in different org

#### PUT /tasks/:id
Update a task (requires `task:update` permission).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "in_progress",
  "description": "Updated description"
}
```

**Response (200):** Updated task object

#### DELETE /tasks/:id
Delete a task (requires `task:delete` permission).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### Audit Logs

#### GET /audit-log
View audit logs (Owner/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "71650226-...",
    "userId": "32a786c9-...",
    "action": "task:create",
    "resourceType": "task",
    "resourceId": "35cb4256-...",
    "allowed": true,
    "reason": null,
    "timestamp": "2026-01-16T00:46:07.000Z"
  }
]
```

**Error (403):**
```json
{
  "message": "Insufficient permissions. Required: audit-log:read",
  "error": "Forbidden",
  "statusCode": 403
}
```

## Testing

### Backend Tests

Run RBAC unit tests:
```bash
npx nx test auth
```

**What's tested:**
- AccessControlService org scoping logic
- Role-to-permission mappings
- Viewer/Admin/Owner permission hierarchies
- Resource ownership checks

### Manual E2E Testing

The backend was manually tested with curl:
- Admin can create tasks
- Viewer cannot create tasks (403)
- Admin can view audit logs
- Viewer cannot view audit logs (403)
- Org scoping works correctly

## Future Improvements

### Security Enhancements
- **Refresh tokens:** Implement token rotation for better security
- **CSRF protection:** Add for cookie-based sessions
- **Rate limiting:** Prevent brute force attacks
- **Password reset:** Email-based password recovery
- **2FA:** Two-factor authentication for sensitive accounts

### Feature Improvements
- **Advanced role delegation:** Custom permission sets per user
- **Task assignments:** Assign tasks to specific users
- **Task comments:** Collaboration on tasks
- **File attachments:** Upload files to tasks
- **Notifications:** Real-time updates for task changes
- **Task templates:** Reusable task structures
- **Search:** Full-text search across tasks

### Performance & Scale
- **RBAC caching:** Redis-based permission cache
- **Database indexing:** Optimize queries on large datasets
- **Pagination:** For task lists and audit logs
- **WebSockets:** Real-time updates for collaborative editing
- **Database migration:** Move from SQLite to PostgreSQL for production

### DevOps
- **Docker:** Containerize API and dashboard
- **CI/CD:** Automated testing and deployment
- **Environment configs:** Separate dev/staging/prod
- **Monitoring:** APM and error tracking (e.g., Sentry)
- **API documentation:** OpenAPI/Swagger spec

### UI/UX
- **Dark mode:** Toggle for user preference
- **Keyboard shortcuts:** Quick actions (e.g., `C` for create task)
- **Batch operations:** Select multiple tasks for bulk actions
- **Task dependencies:** Visualize task relationships
- **Charts:** Completion rates, velocity tracking
- **Accessibility:** WCAG 2.1 AA compliance

## Design Decisions & Tradeoffs

### What Was Prioritized (8-hour timebox)
- **Security correctness** - RBAC, JWT, audit logging  
- **Backend completeness** - All required endpoints working  
- **Core UI functionality** - Kanban board with drag/drop  
- **Clear architecture** - Modular, testable, documented  

### What Was Deprioritized
- **Advanced UI polish** - Basic Tailwind styling (functional, not fancy)  
- **Comprehensive tests** - Focused on critical RBAC logic only  
- **Edge case handling** - Minimal error messages, basic validation  
- **Performance optimization** - Works well with small datasets  

### Technical Choices

**SQLite:** Fast to set up, sufficient for demo. Would use PostgreSQL in production.

**localStorage for JWT:** Simple and works. Would use httpOnly cookies in production.

**No refresh tokens:** Timeboxed decision. Would implement in production.

**Basic audit logging:** Logs to database. Would use dedicated logging service (e.g., ELK stack) in production.

**Inline org hierarchy:** 2 levels hardcoded. Would make recursive for production.

---

## Author

**Jake Mofa**  
Repository: `jmofa-3d2f7c0c-3b3a-4d5a-9c1a-2a2c3f4a5b6`

Built for TurboVets Coding Challenge - Demonstrating security-first thinking, senior-level scoping, and ownership mindset under time constraints.
