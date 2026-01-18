# URL Shortener

A full-stack URL shortening application with user authentication, role-based access control, and analytics. Built with Node.js, Express, MongoDB, React, and TypeScript.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles and Permissions](#user-roles-and-permissions)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- URL shortening with unique short IDs
- URL redirection with visit tracking
- Click analytics and statistics
- User authentication and authorization
- JWT token-based security
- Role-based access control (RBAC)

### User Management
- User registration and login
- Profile management (update personal information)
- Admin panel for user administration
- Multiple user roles: user, volunteer, authority, admin

### URL Management
- Create short URLs (limit: 5 per user, unlimited for admins)
- View personal URLs (users) or all URLs (admins)
- Delete URLs (own URLs for users, any URL for admins)
- Analytics dashboard showing click statistics
- Automatic duplicate URL detection

### Frontend Features
- Modern, responsive UI with glassmorphic design
- Real-time form validation
- Protected routes
- Loading states and error handling
- Toast notifications

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Short ID Generation**: shortid library
- **Environment Configuration**: dotenv
- **CORS**: cors middleware
- **Development**: nodemon

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 4.1.18
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner
- **Linting**: ESLint 9.39.1

## Architecture

The application follows a client-server architecture:

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  React Frontend │ <-----> │  Express API    │
│  (Port 5173)    │  HTTP   │  (Port 5000)    │
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ Mongoose ODM
                                     │
                            ┌────────▼────────┐
                            │                 │
                            │    MongoDB      │
                            │    Database     │
                            │                 │
                            └─────────────────┘
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **MongoDB**: Version 4.x or higher (local installation or MongoDB Atlas account)
- **Git**: For cloning the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shivengoomer/url-shortner.git
cd url-shortner
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/url-shortener
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/url-shortener

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Node Environment
NODE_ENV=development
```

**Important Security Notes:**
- Replace `JWT_SECRET` with a strong, randomly generated secret in production
- Never commit the `.env` file to version control
- Use different secrets for development and production environments

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. If your backend runs on a different port or domain, update the API base URL in `frontend/src/api.ts`.

## Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000` with hot-reloading enabled.

#### Start Frontend Development Server

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:5173`.

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/dist` directory.

#### Start Backend in Production Mode

```bash
cd backend
npm start
```

#### Serve Frontend Build

You can serve the frontend build using a static file server or integrate it with the backend Express server.

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### User Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/user/new` | Create new user account | No | No |
| POST | `/user/login` | Login user | No | No |
| POST | `/user/logout` | Logout user | Yes | No |
| GET | `/user/me` | Get current user profile | Yes | No |
| PATCH | `/user/me` | Update user profile | Yes | No |
| GET | `/user/users` | Get all users | Yes | Yes |
| PATCH | `/user/users/:id/role` | Update user role | Yes | Yes |
| DELETE | `/user/users/:id` | Delete user | Yes | Yes |

#### URL Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/url` | Create short URL | Yes | No |
| GET | `/url` | Get URLs (user's own or all if admin) | Yes | No |
| GET | `/url/:shortId` | Redirect to long URL | No | No |
| GET | `/url/analytics/:shortId` | Get URL analytics | Yes | No |
| DELETE | `/url/:id` | Delete URL | Yes | No |

### Request/Response Examples

#### Create User

**Request:**
```http
POST /user/new
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### Login

**Request:**
```http
POST /user/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### Create Short URL

**Request:**
```http
POST /url
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "longUrl": "https://www.example.com/very/long/url/path"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "shortId": "Abc123",
  "longUrl": "https://www.example.com/very/long/url/path",
  "createdBy": "507f1f77bcf86cd799439010",
  "visitHistory": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Analytics

**Request:**
```http
GET /url/analytics/Abc123
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "reqUrl": {
    "_id": "507f1f77bcf86cd799439011",
    "shortId": "Abc123",
    "longUrl": "https://www.example.com/very/long/url/path",
    "visitHistory": [
      { "timestamp": 1705315800000 },
      { "timestamp": 1705316100000 }
    ]
  },
  "totalClicks": 2
}
```

## User Roles and Permissions

### User Role Hierarchy

1. **user** (Default)
   - Create up to 5 short URLs
   - View own URLs
   - Delete own URLs
   - Update own profile
   - View analytics for own URLs

2. **volunteer**
   - All user permissions
   - Extended access for community management

3. **authority**
   - All volunteer permissions
   - Higher-level administrative privileges

4. **admin**
   - Unlimited URL creation
   - View all URLs in the system
   - Delete any URL
   - View all users
   - Modify user roles
   - Delete users (except self)
   - Full system access

### Setting the First Admin

The first user must be manually promoted to admin in the database:

```javascript
// Connect to MongoDB
use url-shortener

// Update user role to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
url-shortner/
├── backend/
│   ├── controllers/
│   │   ├── authHelper.js       # Authentication middleware
│   │   └── urlFunctions.js     # URL shortening logic
│   ├── models/
│   │   ├── urlSchema.js        # URL data model
│   │   └── userSchema.js       # User data model
│   ├── routes/
│   │   ├── urlRoutes.js        # URL endpoints
│   │   └── userRoutes.js       # User endpoints
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── .env                    # Environment variables (create this)
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # React context (AuthContext)
│   │   ├── lib/                # Utility functions
│   │   ├── pages/              # Page components
│   │   │   ├── admin.tsx       # Admin panel
│   │   │   ├── auth.tsx        # Login/Signup
│   │   │   ├── homepage.tsx    # Main dashboard
│   │   │   └── profile.tsx     # User profile
│   │   ├── App.tsx             # Main app component
│   │   ├── api.ts              # API client
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── IMPLEMENTATION.md           # Implementation details
└── README.md                   # This file
```

## Deployment

### Backend Deployment

#### Environment Variables for Production

Ensure the following environment variables are set:

```env
PORT=5000
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
NODE_ENV=production
```

#### Recommended Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control over infrastructure
- **DigitalOcean**: App Platform or Droplets
- **Railway**: Modern deployment platform
- **Render**: Free tier available

#### Example: Deploying to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add MongoDB addon or use MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here

# Deploy
git subtree push --prefix backend heroku main

# Or if using a separate backend repo
cd backend
git init
heroku git:remote -a your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment

#### Build the Frontend

```bash
cd frontend
npm run build
```

#### Recommended Platforms

- **Vercel**: Optimized for React applications
- **Netlify**: Simple deployment with continuous integration
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for public repositories

#### Example: Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Update API Base URL

Before deployment, update the API base URL in `frontend/src/api.ts` to point to your production backend URL.

### Database Deployment

#### MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your application's IP addresses
3. Create a database user
4. Get the connection string
5. Update `MONGO_URI` in your environment variables

## Security Considerations

### Implemented Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **CORS Protection**: Configured CORS to allow specific origins
4. **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies (in addition to local storage)
5. **Role-Based Access Control**: Granular permissions based on user roles
6. **Input Validation**: Server-side validation of all inputs

### Production Security Checklist

- [ ] Use strong, unique JWT secret (minimum 256 bits)
- [ ] Enable HTTPS/TLS for all communications
- [ ] Set secure CORS policy (restrict allowed origins)
- [ ] Implement rate limiting to prevent abuse
- [ ] Add request logging and monitoring
- [ ] Regular security audits and dependency updates
- [ ] Use environment-specific configurations
- [ ] Enable MongoDB authentication
- [ ] Implement password strength requirements
- [ ] Add CSRF protection for state-changing operations
- [ ] Sanitize user inputs to prevent injection attacks
- [ ] Set appropriate HTTP security headers
- [ ] Implement account lockout after failed login attempts
- [ ] Add email verification for new accounts
- [ ] Regular backup of database

### Recommended Additional Security Measures

1. **Rate Limiting**: Implement express-rate-limit to prevent brute force attacks
2. **Helmet.js**: Add security headers
3. **Input Sanitization**: Use express-validator or joi for input validation
4. **SQL Injection Prevention**: Already handled by Mongoose ODM
5. **XSS Prevention**: Sanitize user inputs, use Content Security Policy
6. **Session Management**: Implement token refresh mechanism
7. **Logging**: Add winston or morgan for comprehensive logging

## Contributing

We welcome contributions to improve this project. Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- **Backend**: Follow Airbnb JavaScript Style Guide
- **Frontend**: Follow React and TypeScript best practices
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Use Prettier for consistent code formatting

### Testing

Ensure all tests pass before submitting a pull request:

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the IMPLEMENTATION.md with technical details
3. Ensure your code follows the existing style
4. Add meaningful commit messages
5. Reference any related issues in the PR description

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Support

For issues, questions, or contributions, please:

1. Check existing issues on GitHub
2. Create a new issue with a clear description
3. Provide steps to reproduce any bugs
4. Include relevant logs and screenshots

## Acknowledgments

- Built with Node.js and Express
- UI components inspired by modern design principles
- Database powered by MongoDB
- Authentication implemented with JWT

## Roadmap

Future enhancements planned:

- [ ] Custom short URL aliases
- [ ] QR code generation for short URLs
- [ ] Detailed analytics dashboard with charts
- [ ] URL expiration dates
- [ ] Password-protected URLs
- [ ] API rate limiting
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] URL tags and categories
- [ ] Bulk URL creation
- [ ] Export analytics data
- [ ] Link preview generation
- [ ] Dark mode support
- [ ] Mobile application

---

Built with care by the development team. For more information, visit the [GitHub repository](https://github.com/shivengoomer/url-shortner).
