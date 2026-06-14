# SSH Travel Planner Frontend

Frontend application for the **SSH Travel Planner** project developed as part of the **Distributed Systems** course.

The application provides a modern travel planning and booking platform where users can explore destinations, search flights and hotels, create bookings, manage reviews, receive AI-powered travel recommendations, and access tenant-specific services through a multi-tenant architecture.

## Technologies Used

- React 19
- TypeScript
- Vite
- React Router DOM
- Context API
- Axios
- Mantine UI
- JWT Authentication
- REST API Integration

Project Architecture

The project is organized as a local monorepo consisting of two separate applications:

TravelPlanner/
│
├── docker-compose.yml
│
├── SSH-Travel-Planner-Backend/
│
└── SSH-Travel-Planner-Frontend/

The entire system is orchestrated using Docker Compose and includes the following services:

PostgreSQL Database
Redis Cache & Queue
NestJS Backend API
React Frontend Application
Running the Complete System
Prerequisites
Docker
Docker Compose
Start All Services

From the project root directory (where docker-compose.yml is located), run:

docker-compose up --build

or

docker compose up --build
Available Services
Service Port Description
Frontend 8080 React Application
Backend 5000 NestJS REST API
PostgreSQL 5432 Database
Redis 6379 Cache & Background Jobs
Access the Application

Frontend:

http://localhost:8080

Backend API:

http://localhost:5000

Swagger Documentation:

http://localhost:5000/api
Docker Infrastructure

The application uses Docker Compose to automatically create and connect all required services through a shared network.

PostgreSQL

Stores application data including users, bookings, destinations, flights, hotels, reviews, and tenant information.

Redis

Used for:

Caching
Session management
Background jobs (Bull Queue)
AI request processing
Backend

NestJS application exposing REST APIs and business logic.

Frontend

React application providing the user interface and communicating with the backend via HTTP requests.

All services communicate through the internal Docker network travel-network.

## Features

### Authentication & Authorization

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Role-Based Access Control
- User Profile Management

### Travel Management

- Destinations Management
- Flights Management
- Hotels Management
- Rooms Management
- Airlines Management
- Airports Management
- Activities Management
- Travel Packages

### Booking System

- Create Bookings
- Booking Items
- Payments Management
- Coupons & Discounts
- Wishlist Functionality
- Reviews & Ratings

### Multi-Tenancy

- Tenant-specific data isolation
- Tenant Settings
- Tenant Statistics
- Tenant Context Management

### Administration

- Admin Dashboard
- Tenant Management
- Background Jobs Monitoring
- Global Statistics
- User Management

### AI Integration

- AI Travel Recommendations
- AI Chat Assistant
- Personalized Travel Suggestions

## Project Structure

```text
src/
│
├── api/
│   └── axios.ts
│
├── assets/
│   └── Images and static resources
│
├── components/
│   ├── LandingDrawer.tsx
│   ├── ProtectedRoute.tsx
│   └── RoleBasedRoute.tsx
│
├── context/
│   ├── AuthContext.tsx
│   ├── TenantContext.tsx
│   ├── DestinationContext.tsx
│   ├── ThemeContext.tsx
│   ├── TravelContext.tsx
│   └── UserInteractionContext.tsx
│
├── hooks/
│   ├── useCrud.ts
│   ├── useTenant.ts
│   └── useTenantStats.ts
│
├── layouts/
│   ├── PublicLayout.tsx
│   ├── AuthenticatedLayout.tsx
│   └── AdminLayout.tsx
│
├── pages/
│   ├── auth/
│   ├── destination/
│   ├── admin/
│   ├── super-admin/
│   ├── tenant/
│   └── user/
│
├── services/
│   ├── api.ts
│   └── BaseCrudService.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

## Available Pages

### Public Pages

- Landing Page
- Login
- Register

### User Pages

- Profile
- Destinations
- Flights
- Hotels
- Rooms
- Bookings
- Reviews
- Payments
- Notifications
- Wishlist

### Admin Pages

- Admin Statistics
- Tenant Statistics
- Background Jobs

### Super Admin Pages

- Tenant Management
- Global Tenant Statistics

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd SSH-Travel-Planner-Frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Backend Connection

The frontend communicates with the NestJS backend through REST APIs.

Example API configuration:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

## Authentication Flow

1. User logs in.
2. Backend returns JWT token.
3. Token is stored locally.
4. Axios attaches token to requests.
5. Protected routes validate authentication.
6. Role-based routes validate permissions.

## Context Providers

The application uses Context API for global state management:

- AuthContext
- TenantContext
- DestinationContext
- TravelContext
- ThemeContext
- UserInteractionContext

## Distributed Systems Features

The project fulfills the Distributed Systems requirements through:

- Client-Server Architecture
- RESTful Communication
- JWT Authentication
- Multi-Tenancy Support
- AI Service Integration
- Background Job Processing
- Caching Support
- Scalable Modular Architecture

## Development Team

**Course:** Distributed Systems

**Project:** SSH Travel Planner

**Date:** June 2026

## License

This project was developed for academic purposes as part of the Distributed Systems course.
