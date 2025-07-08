# Conference Paper Management System

This is a comprehensive full-stack web application designed to streamline the academic paper submission and review process for conferences. The platform serves as a digital hub where researchers, authors, and conference administrators can efficiently manage the entire paper lifecycle - from initial abstract submission to final paper evaluation.

## What This Application Does

### For Authors/Researchers:

- **Paper Submission Workflow**: Submit research papers in a structured two-phase process:
  - **Abstract Phase**: Submit initial abstracts with basic paper information
  - **Full Paper Phase**: Submit complete research papers after abstract approval
- **File Management**: Upload PDF documents with secure file handling and storage
- **Submission Tracking**: Monitor the status of submitted papers throughout the review process
- **Re-submission Capability**: Update and re-upload papers when requested by administrators
- **Profile Management**: Maintain personal academic profile and submission history
- **Payment Integration**: Handle conference fees with payment ID tracking

### For Conference Administrators:

- **Comprehensive Dashboard**: Access a powerful admin panel with real-time statistics and analytics
- **User Management**: View, manage, and moderate user accounts and their submissions
- **Paper Review System**:
  - Evaluate submitted papers with detailed assessment tools
  - Update paper status (pending, approved, rejected, etc.)
  - Download and review all submitted documents
  - Track submission history and version control
- **Submission Control**: Toggle abstract and full paper submission phases
- **Analytics & Reporting**:
  - View submission statistics and trends
  - Monitor theme distribution across papers
  - Track user activity and engagement metrics
- **File Administration**: Upload and manage conference-related documents

### Core Functionality:

- **Secure Authentication**: JWT-based user authentication system with role-based access control
- **Real-time Communication**: Integrated chat system for seamless communication between users
- **Document Viewer**: In-browser PDF viewing capabilities for easy paper review
- **Conference Information**: Dedicated pages for conference details, schedules, speakers, and important dates
- **Responsive Design**: Modern, mobile-friendly interface built with React and TailwindCSS

This application essentially digitizes and automates the traditional conference paper submission process, making it more efficient, transparent, and manageable for both authors and conference organizers.

## Tech Stack

**Client:** React, Vite, TailwindCSS, Axios, Framer Motion

**Server:** Node.js, Express.js, MongoDB, Mongoose, JWT for authentication

## Features

### User Authentication & Security

- **Secure Registration/Login**: JWT-based authentication system with encrypted password storage
- **Role-based Access Control**: Separate access levels for regular users and administrators
- **Session Management**: Secure session handling with token-based authentication

### Paper Submission System

- **Two-Phase Submission Process**:
  - Abstract submission with basic paper details
  - Full paper submission after abstract approval
- **File Upload Management**: Secure PDF upload with file validation and storage
- **Submission History**: Complete tracking of all paper versions and modifications
- **Re-upload Functionality**: Ability to update papers when requested by administrators
- **Payment Integration**: Payment ID tracking for conference fees

### Admin Dashboard & Management

- **User Management**:
  - View all registered users with detailed profiles
  - Monitor user activity and submission counts
  - Access user-specific paper submissions
- **Paper Management**:
  - Review and evaluate all submitted papers
  - Update paper status (pending, approved, rejected, etc.)
  - Download papers for offline review
  - Toggle submission phases (abstract/full paper)
- **Analytics & Statistics**:
  - Real-time dashboard with submission metrics
  - Theme distribution charts and analysis
  - Status distribution visualization
  - Recent activity tracking
- **File Administration**: Upload and manage conference documents

### Communication & Interaction

- **Integrated Chat System**: Real-time messaging for user communication
- **Document Viewer**: In-browser PDF viewing without downloads
- **Notification System**: Status updates and important announcements

### Conference Information Pages

- **Home Page**: Dynamic conference overview with animations
- **About Section**: Conference mission and vision
- **Important Dates**: Key deadlines and milestones
- **Speakers & Committee**: Information about conference participants
- **Schedule**: Event timeline and agenda
- **Sponsorship**: Partnership and funding information

### Technical Features

- **Responsive Design**: Mobile-first design with TailwindCSS
- **Modern UI/UX**: Smooth animations with Framer Motion
- **RESTful API**: Well-structured backend API with proper error handling
- **Database Management**: MongoDB with Mongoose ODM for data persistence
- **File Storage**: Secure file handling with Multer middleware

## Run Locally

To run this project locally, you'll need to run the frontend and backend servers separately.

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### Frontend

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    `bash
    npm run dev
    `
    The application will be available at `http://localhost:5173` (or another port if specified by Vite).

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` directory:

- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for signing JWTs
- `PORT`: Port number for the backend server (optional, defaults to 5000)

## Project Structure

```
conference-management-system/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controller/         # Route controllers
│   ├── middleware/         # Custom middleware (auth, file upload)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File storage directory
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
└── README.md              # Project documentation
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Paper Routes

- `POST /api/papers/submit` - Submit abstract
- `POST /api/papers/:id/full-paper` - Submit full paper
- `GET /api/papers/user` - Get user's papers
- `GET /api/papers/:id` - Get specific paper
- `PATCH /api/papers/:id/payment` - Update payment ID

### Admin Routes

- `GET /api/admin/users` - Get all users
- `GET /api/admin/papers` - Get all papers
- `PUT /api/admin/papers/:id/status` - Update paper status
- `PUT /api/admin/papers/:id/evaluate` - Evaluate paper

### Chat Routes

- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message
