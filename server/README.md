#                   TravelEase API

# Project Overview
TravelEase API is a RESTful backend service for a travel booking system. It supports browsing destinations and holiday packages, user registration and login and the creation and management of travel bookings.
The project solves the problem of managing travel-related data in a structured and secure way. It provides a central API that allows the front-end application to retrieve travel packages, manage bookings, and enforce role-based access for normal users and administrators.
This project is useful because it demonstrates a complete server-side application using modern web development technologies such as Node.js, Express.js, MongoDB, Mongoose, and JWT authentication.

# Purpose of the Application
The purpose of TravelEase API is to provide a backend system for a trip booking platform where:
1. users can browse destinations and travel packages
2. users can register, log in, and manage their bookings
3. admin users can manage destinations, packages, and booking decisions
4. bookings can be confirmed, cancelled, or rejected with a rejection reason

# Features
1. User registration and login using JWT authentication
2. Role-based authorization for admin and normal users
3. CRUD operations for destinations, packages and bookings
4. Protected routes using authentication middleware
5. Input validation using express-validator
6. Search and sort support for packages
7. Nested route for retrieving packages by destination
8. Booking rejection with rejection reason

# Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- express-validator
- express-async-handler
- Morgan
- Caddy

# API Endpoints

# Auth
- POST /api/auth/register — Register a new user
- POST /api/auth/login — Login and receive JWT token

# Users
- GET /api/users — Get logged-in user profile

# Destinations
- GET /api/destinations — Get all destinations
- GET /api/destinations/:id — Get destination by ID
- POST /api/destinations — Create destination (admin only)
- PUT /api/destinations/:id — Update destination (admin only)
- DELETE /api/destinations/:id — Delete destination (admin only)
- GET /api/destinations/:id/packages — Get all packages for a destination

# Packages
- GET /api/packages — Get all packages
- GET /api/packages/:id — Get package by ID
- POST /api/packages — Create package (admin only)
- PUT /api/packages/:id — Update package (admin only)
- DELETE /api/packages/:id — Delete package (admin only)

# Bookings
- GET /api/bookings — Get all bookings (admin) or own bookings (user)
- GET /api/bookings/:id — Get booking by ID
- POST /api/bookings — Create booking
- PUT /api/bookings/:id — Update booking
- DELETE /api/bookings/:id — Delete booking

# Application Architecture
The application follows a layered architecture:
- server.js — entry point of the application
- src/routes/ — defines API endpoints
- src/controllers/ — contains business logic for request handling
- src/models/ — defines Mongoose schemas and database models
- src/middleware/ — handles authentication, authorization, validation, logging, and error handling
This structure improves maintainability, readability, and separation of concerns.

# Dependencies and Installation

# Prerequisites
- Node.js installed  
- npm installed  
- MongoDB running locally or remotely  

# Installation Steps
1. Navigate to the backend directory: cd server
2. Install dependencies: npm install
3. Create a .env file in the root directory:
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. Start the server: npm start
5. The API will run on: http://localhost:3000/api

# Usage
Once the server is running, the API can be used through:
1. Frontend application (React client)
2. API tools like Hoppscotch or Postman

# Example workflows:
Register a new user → /api/auth/register
Login and get token → /api/auth/login
Use token to access protected routes
Create a booking → /api/bookings
Admin confirms or rejects booking

# Deployment
The backend is deployed using Caddy as a reverse proxy.
Public API base URL: https://banksia02.ifn666.com/assessment02/api
Caddy routes incoming traffic to the Node.js server running on localhost.

# Contributing
Contributions are welcome.
To contribute:  improvements can be made by reviewing and modifying the source code directly.

# Reporting Issues
If you encounter any issues:
1. Provide a clear description
2. Include steps to reproduce
3. Mention expected vs actual behaviour
4. Add screenshots if needed

# Future Improvements
1. Pagination for large datasets
2. Payment integration
3. Email notifications
4. Advanced filtering options

# Troubleshooting
Issue: MongoDB connection failed
Solution: Check your MONGODB_URI in .env
Issue: Server not starting
Solution: Ensure Node.js is installed and run: node -v

# License
This project is licensed under the MIT License- see the LICENSE file for details.