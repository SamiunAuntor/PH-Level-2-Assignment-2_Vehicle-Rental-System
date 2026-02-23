# 🚗 Vehicle Rental System

## 🔗 Project Name & Live URL

**Project**: Vehicle Rental System (Backend API)  
**Live URL (demo)**: `https://vehicle-rental-system-demo.example.com` *(dummy placeholder URL)*

---

## 🎯 Project Overview

The **Vehicle Rental System** is a backend REST API for managing a complete vehicle rental workflow, including:
- **Vehicles** – Manage vehicle inventory with availability tracking
- **Customers** – Maintain customer accounts and profiles
- **Bookings** – Handle vehicle rentals, returns, and cost calculation
- **Authentication & Authorization** – Role-based access control for Admin and Customer users

This project is suitable as a learning-grade or production-ready foundation for rental platforms (cars, bikes, vans, SUVs) where secure, well-structured APIs are required.

---

## 🌟 Key Features

- **User Management**: Secure registration, login, and profile management
- **Role-Based Access Control**: Distinct permissions for Admin and Customer
- **Vehicle Inventory Management**: CRUD operations with availability status
- **Booking Management**: Create, update, cancel, and return bookings
- **Price Calculation**: Automatic rental cost calculation based on duration and daily rate
- **JWT Security**: Token-based authentication protecting sensitive endpoints

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## 🚀 Setup & Usage

### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** or **yarn**
- **PostgreSQL** database server

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root and configure your environment variables, for example:

```bash
PORT=5000
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=your_jwt_secret_here
```

Adjust the variables according to your local PostgreSQL setup and project configuration.

### 4. Database Setup

Create a PostgreSQL database and set up the tables according to the **Database Tables** section below.  
You can use your preferred migration tool or run SQL statements manually that reflect these schemas.

### 5. Run the Application

- **Development**:

```bash
npm run dev
```

- **Production build**:

```bash
npm run build
npm start
```

The API will typically be available at: `http://localhost:<PORT>/api/v1`

### 6. Using the API

- Use tools like **Postman**, **Insomnia**, or **curl** to interact with the endpoints.
- Authenticate via the `/api/v1/auth/signin` endpoint to obtain a JWT.
- Include the token in the `Authorization` header as `Bearer <token>` for protected routes.

---

## 📁 Code Structure

The codebase is designed to follow a **modular pattern** with clear separation of concerns.  
Typical structure (may vary slightly based on final implementation):

- **Feature-based modules**: `auth`, `users`, `vehicles`, `bookings`
- **Layered design** within each module:
  - **Routes** – Define HTTP endpoints
  - **Controllers** – Handle request/response logic
  - **Services** – Encapsulate business logic

This structure makes the codebase maintainable, testable, and easy to extend.

---

## 📊 Database Tables

### Users
| Field | Notes |
|-------|-------|
| id | Auto-generated |
| name | Required |
| email | Required, unique, lowercase |
| password | Required, min 6 characters |
| phone | Required |
| role | 'admin' or 'customer' |

### Vehicles
| Field | Notes |
|-------|-------|
| id | Auto-generated |
| vehicle_name | Required |
| type | 'car', 'bike', 'van' or 'SUV' |
| registration_number | Required, unique |
| daily_rent_price | Required, positive |
| availability_status | 'available' or 'booked' |

### Bookings
| Field | Notes |
|-------|-------|
| id | Auto-generated |
| customer_id | Links to Users table |
| vehicle_id | Links to Vehicles table |
| rent_start_date | Required |
| rent_end_date | Required, must be after start date |
| total_price | Required, positive |
| status | 'active', 'cancelled' or 'returned' |

---

## 🔐 Authentication & Authorization

### User Roles
- **Admin** – Full system access to manage vehicles, users, and all bookings
- **Customer** – Can register, view vehicles, and create/manage own bookings

### Authentication Flow
1. Passwords are hashed using **bcrypt** before being stored in the database.
2. Users log in via `/api/v1/auth/signin` and receive a **JWT (JSON Web Token)**.
3. Protected endpoints require a token in the header: `Authorization: Bearer <token>`.
4. The token is validated and user permissions are checked.
5. Access is granted if authorized; otherwise, the API returns **401 (Unauthorized)** or **403 (Forbidden)**.

---

## 🌐 API Endpoints

> 📖 **For detailed request/response specifications, see the [API Reference](API_REFERENCE.md)**  
> All endpoints are documented there, including:
> - Exact URL patterns (e.g., `/api/v1/vehicles/:vehicleId`)
> - Request body structure and field names
> - Response format and data structure

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive JWT token |

---

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin only | Add new vehicle with name, type, registration, daily rent price and availability status |
| GET | `/api/v1/vehicles` | Public | View all vehicles in the system |
| GET | `/api/v1/vehicles/:vehicleId` | Public | View specific vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details, daily rent price or availability status |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist) |

---

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin only | View all users in the system |
| PUT | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin only | Delete user (only if no active bookings exist) |

---

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer or Admin | Create booking with start/end dates<br>• Validates vehicle availability<br>• Calculates total price (daily rate × duration)<br>• Updates vehicle status to "booked" |
| GET | `/api/v1/bookings` | Role-based | Admin: View all bookings<br>Customer: View own bookings only |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |

---

## 📚 Additional Resources

- **[API Reference](API_REFERENCE.md)** - Detailed endpoint documentation with request/response examples
- **[Submission Guide](SUBMISSION_GUIDE.md)** - Assignment submission requirements and deadlines