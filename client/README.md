#                                  TravelEase Frontend

# Project Overview
TravelEase Frontend is a React-based web application for a travel booking system. It allows users to explore destinations, view travel packages and make bookings.
The application solves the problem of providing a simple, responsive and intuitive interface for managing travel bookings, while seamlessly communicating with a REST API backend.
This project demonstrates a modern full-stack architecture using React, API integration, authentication and role-based user interaction.

# Purpose of the Application
The purpose of this application is to provide a user interface for the TravelEase system where:
1. Users can browse destinations and packages
2. Users can register and log in securely
3. Users can create and manage bookings
4. Admin users can manage travel data and booking decisions

# Features
1. Browse destinations and travel packages
2. View detailed package information
3. User registration and login
4. JWT-based authentication
5. Create, update, cancel and delete bookings
6. Admin dashboard for managing: destinations, packages, bookings (confirm/reject with reason)
7. Search and filter packages
8. Responsive UI using Mantine components

# Technologies Used
1. React (Vite)
2. React Router (BrowserRouter)
3. Mantine UI (for design and components)
4. Fetch API (for backend communication)
5. LocalStorage (for token storage)
6. CSS / Styling

# Application Architecture
The frontend follows a component-based architecture:
1. pages/ → Main application pages (Home, Packages, Booking, Admin, etc.)
2. components/ → Reusable UI components (Navbar, PackageCard, DestinationCard, etc.)
3. routes/ → Handles client-side routing using React Router  
4. services/ → API communication layer (fetch requests to backend)
5. context/ → Authentication and global state management
This structure ensures separation of concerns, reusability of components, maintainability and scalability

### Dependencies and Installation
# Prerequisites
1. Node.js installed
2. npm installed
3. Backend API running (local or deployed)

# Installation Steps
1.	Navigate to the frontend directory:cd client
3.	Install dependencies: npm install
4.	Create a .env file in the project root and add: VITE_API_URL=https://banksia02.ifn666.com/assessment02/api
5.	Start the development server:	npm run dev
6.	Open the application in your browser:	http://localhost:5173

# Usage
After starting the application, users can interact with the system as follows:
1. Browse destinations from the landing page
2. View available packages from the packages page
3. Click "View Details" to see full package information
4. Register a new account or log in
5. Create bookings by entering traveller details
6. View and manage bookings in the "My Bookings" page
7. Admin users can confirm bookings, reject bookings with a reason, manage destinations and packages

# API Integration
This frontend communicates with the TravelEase REST API.
1. All data such as destinations, packages, bookings and users are fetched from the backend API
2. Authentication is handled using JWT tokens
3. Protected routes require a valid token
Example API base URL: https://banksia02.ifn666.com/assessment02/api

# Contributing
Contributions are welcome.
To contribute to this project: improvements can be made by reviewing and modifying the source code directly.
Please ensure your code is clean, readable, and follows the existing project structure.

# Reporting Issues
If you encounter any issues or bugs, please report them with:
1. a clear title
2. a description of the issue
3. steps to reproduce
4. expected vs actual behaviour
5. screenshots (if applicable)

# Future Improvements
Possible enhancements for the application include:
1. Pagination for large datasets
2. Image upload support for destinations and packages
3. Payment integration for bookings
4. Email notifications for booking updates
5. Improved admin analytics dashboard

# License
This project is licensed under the MIT License- see the LICENSE file for details.