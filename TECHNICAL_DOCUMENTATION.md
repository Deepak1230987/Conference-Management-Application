# Technical Documentation — ICTACEM 2025 Conference Website & Paper Management System

## 1. Overview

This repository contains a full-stack web application used to run the ICTACEM 2025 conference website and to manage paper submissions.

**Major capabilities**

- Public conference website: pages for conference information, schedule, speakers, sponsorship, downloadable PDFs (brochure, templates, payment procedure, technical schedule, book of abstracts, venue map).
- Author system: user registration/login, profile, paper/abstract submission workflow, file uploads.
- Admin system: dashboard for reviewing papers, managing users, toggling submission phases, viewing stats.
- Notifications and (optional) chat features.

**Tech stack**

- Frontend: React (Vite), React Router, Tailwind CSS
- Backend: Node.js (ES Modules), Express, MongoDB (Mongoose)
- Auth: JWT + cookies (via `cookie-parser`)
- File uploads: Multer
- Email: Nodemailer (used for reset password flows / testing)

Repository structure (top-level)

```
backend/   # Express REST API + MongoDB + PDF/static/doc serving
client/    # React (Vite) app
README.md  # product-level overview
```

---

## 2. How to Run (Development)

### 2.1 Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or hosted)

### 2.2 Environment Variables

Backend uses `dotenv` and expects at minimum:

- `MONGODB_URI` — MongoDB connection string
- `PORT` — optional, defaults to `5001`
- `CLIENT_URL` — optional; used in CORS, defaults to `http://10.25.1.5/ictacem2025`

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ictacem
PORT=5001
CLIENT_URL=http://localhost:5173
```

### 2.3 Start Backend

From `backend/`:

- `npm install`
- `npm run dev` (nodemon)

### 2.4 Start Frontend

From `client/`:

- `npm install`
- `npm run dev`

### 2.5 Routing Base Path

Frontend Router uses:

```jsx
<Router basename="/ictacem2025">
```

This means:

- locally you may need to access the frontend at `/ictacem2025/` when deployed behind a path.
- the backend exposes most APIs under `/ictacem2025/api/...` and keeps `/api/...` for backward compatibility.

---

## 3. Project Structure (Detailed)

### 3.1 Backend Directory Structure

```
backend/
├── server.js                  # Express app entry point
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (not in repo)
├── config/
│   └── db.js                  # MongoDB connection setup
├── controller/
│   ├── auth.controller.js     # Auth logic (register, login, password reset)
│   ├── paper.controller.js    # Paper submission & management
│   ├── admin.controller.js    # Admin operations
│   ├── chat.controller.js     # Chat functionality
│   ├── notification.controller.js  # Notifications
│   └── sponsors.controller.js # Sponsor management
├── middleware/
│   ├── auth.middleware.js     # JWT validation & role checking
│   └── multer.js              # File upload configuration
├── models/
│   ├── user.model.js          # User schema with auth
│   ├── paper.model.js         # Paper/abstract schema
│   └── notification.model.js  # Notification schema
├── routes/
│   ├── auth.route.js          # Authentication endpoints
│   ├── paper.route.js         # Paper CRUD endpoints
│   ├── admin.route.js         # Admin endpoints
│   ├── chat.route.js          # Chat endpoints
│   ├── notification.route.js  # Notification endpoints
│   └── sponsors.route.js      # Sponsor endpoints
├── utils/
│   └── idGenerator.js         # Custom user ID generation
├── public/
│   ├── documents/             # Public PDFs (brochure, schedule, etc.)
│   ├── sponsors/              # Sponsor logos/images
│   └── pdfviewer.html         # PDF viewer page
└── uploads/                   # User-uploaded papers (abstracts/full papers)
```

### 3.2 Frontend Directory Structure

```
client/
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # Global styles
│   ├── index.css              # Tailwind imports
│   ├── assets/                # Images, fonts, etc.
│   ├── components/
│   │   ├── Navbar.jsx         # Main navigation bar
│   │   ├── Footer.jsx         # Site footer
│   │   ├── HeroSection.jsx    # Homepage hero with CTAs
│   │   ├── ChatBox.jsx        # Chat interface
│   │   ├── SimpleCaptcha.jsx  # Captcha component
│   │   ├── admin/             # Admin-specific components
│   │   │   ├── UserDetailsPage.jsx
│   │   │   ├── PaperDetailsPage.jsx
│   │   │   └── SubmissionHistoryModal.jsx
│   │   └── notifications/     # Notification components
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state
│   ├── hooks/                 # Custom React hooks
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── About.jsx          # About conference
│   │   ├── Login.jsx          # User login
│   │   ├── Registration.jsx   # User registration
│   │   ├── ForgotPassword.jsx # Password reset request
│   │   ├── ResetPassword.jsx  # Password reset form
│   │   ├── Profile.jsx        # User profile/dashboard
│   │   ├── SubmitPaper.jsx    # Abstract submission form
│   │   ├── SubmitFullPaper.jsx # Full paper submission
│   │   ├── Schedule.jsx       # Conference schedule
│   │   ├── ImportantDates.jsx # Key dates
│   │   ├── Speakers.jsx       # Speaker listings
│   │   ├── PlenarySpeakers.jsx # Plenary speakers (sorted, highlighted)
│   │   ├── Committee.jsx      # Organizing committee
│   │   ├── Sponsors.jsx       # Sponsor display
│   │   ├── Sponsorship.jsx    # Sponsorship info
│   │   ├── Brouchure.jsx      # Conference brochure viewer
│   │   ├── BookOfAbstracts.jsx # Technical schedule + abstracts
│   │   ├── ExtendedAbstractFormat.jsx # Abstract format PDF
│   │   ├── FullLengthPaperFormat.jsx  # Paper format PDF
│   │   ├── PaymentProcedure.jsx       # Payment instructions
│   │   ├── NotificationsPage.jsx      # User notifications
│   │   └── Admin.jsx          # Admin dashboard
│   └── utils/                 # Utility functions
```

---

## 4. Backend Architecture

### 3.1 Server Entry Point

- File: `backend/server.js`

**Responsibilities**

- Connect to MongoDB via `connectDB()` (`backend/config/db.js`).
- Configure CORS.
- Parse JSON requests and cookies.
- Serve static assets and public documents.
- Mount REST API routes.

### 3.2 CORS Configuration

CORS is configured with `credentials: true` and a whitelist-like `origin` array.
This allows cookie-based auth from approved frontend origins.

### 3.3 Static & Document Serving

`backend/server.js` includes:

```js
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/ictacem2025/api/documents",
  express.static(path.join(__dirname, "public/documents"))
);
app.use(
  "/api/documents",
  express.static(path.join(__dirname, "public/documents"))
);
```

**Implications**

- Any PDF placed in `backend/public/documents` becomes accessible at:
  - `/ictacem2025/api/documents/<filename>`
  - `/api/documents/<filename>`

This is the preferred mechanism for downloadable PDFs, since the browser can handle them directly.

### 3.4 Explicit PDF Routes (Header-Controlled)

Some documents are served via dedicated routes to enforce consistent `Content-Type` and headers (inline view vs download name).
Examples:

- `/ictacem2025/api/brochure`
- `/ictacem2025/api/payment-procedure`
- `/ictacem2025/api/book-of-abstracts` (currently serves **Technical Schedule**)

**Inline vs Attachment**

- `inline`: opens in browser viewer
- `attachment`: triggers download

If you want the same experience as `/ictacem2025/api/documents/...`, prefer the static approach.

### 3.5 API Route Mounting

Mounted with and without prefix:

- Primary: `/ictacem2025/api/...`
- Backward compatible: `/api/...`

Routes:

- `authRoutes` → `backend/routes/auth.route.js`
- `paperRoutes` → `backend/routes/paper.route.js`
- `adminRoutes` → `backend/routes/admin.route.js`
- `chatRoutes` → `backend/routes/chat.route.js`
- `notificationRoutes` → `backend/routes/notification.route.js`
- `sponsorsRoutes` → `backend/routes/sponsors.route.js`

---

## 5. Database Schema (Detailed)

### 5.1 User Collection

**Collection Name:** `users`

```javascript
{
  _id: ObjectId,
  username: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  customUserId: String (required, unique, e.g., "ICTACEM2025-001"),
  password: String (required, hashed with bcrypt, min 6 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  resetPasswordToken: String (nullable),
  resetPasswordExpire: Date (nullable),
  createdAt: Date (default: Date.now)
}
```

**Indexes:**

- `email` (unique)
- `customUserId` (unique)

**Security:**

- Password hashed using bcrypt (salt rounds: 10) in pre-save hook
- Reset token generated using crypto and hashed before storage
- Password never returned in API responses

**Custom User ID Format:**

- Pattern: `ICTACEM2025-XXX` (where XXX is zero-padded number)
- Generated sequentially starting from 001
- Used for user identification in conference communications

### 5.2 Paper Collection

**Collection Name:** `papers`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),

  // Paper Information
  title: String (required, trimmed),
  authors: [
    {
      name: String (required, trimmed),
      email: String (trimmed),
      affiliation: String (trimmed),
      address: String (trimmed)
    }
  ],

  // File Storage
  pdfPath: String (nullable, path to abstract PDF),
  fullPaperPdfPath: String (nullable, path to full paper PDF),

  // Submission History (for versioning)
  abstractSubmissionHistory: [
    {
      filePath: String (required),
      fileName: String (required),
      submittedAt: Date (default: Date.now),
      size: Number,
      mimetype: String
    }
  ],
  fullPaperSubmissionHistory: [
    {
      filePath: String (required),
      fileName: String (required),
      submittedAt: Date (default: Date.now),
      size: Number,
      mimetype: String
    }
  ],

  // Additional Fields
  theme: String (e.g., "Computational Mechanics"),
  keywords: String,
  abstract: String,
  correspondingAuthor: {
    name: String,
    email: String,
    phone: String,
    affiliation: String
  },

  // Status & Review
  status: String (enum: ['pending', 'approved', 'rejected', ...], default: 'pending'),
  adminNotes: String,
  reviewComments: String,

  // Payment
  paymentId: String (nullable),
  paymentStatus: String,

  // Flags
  abstractResetRequested: Boolean (default: false),
  fullPaperResetRequested: Boolean (default: false),

  // Timestamps
  submittedAt: Date (default: Date.now),
  updatedAt: Date,
  fullPaperSubmittedAt: Date (nullable)
}
```

**Indexes:**

- `user` (for quick user paper lookup)
- `status` (for filtering)
- `theme` (for statistics)

**Relationships:**

- `user` → references `User` collection
- One user can have multiple papers
- Papers retain submission history for audit trail

### 5.3 Notification Collection

**Collection Name:** `notifications`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', nullable for global notifications),
  title: String (required),
  message: String (required),
  type: String (enum: ['info', 'success', 'warning', 'error'], default: 'info'),
  read: Boolean (default: false),
  link: String (nullable, URL to related resource),
  createdAt: Date (default: Date.now),
  expiresAt: Date (nullable, for auto-cleanup)
}
```

**Query Patterns:**

- Get all unread notifications for user
- Get global notifications (where `user` is null)
- Mark notification as read
- Auto-delete expired notifications

---

## 6. Authentication & Authorization (Detailed)

### 6.1 Authentication Flow

#### 6.1.1 Registration Flow

```
User submits registration form
    ↓
Frontend validates input
    ↓
POST /api/auth/register
    ↓
Backend checks if email/username exists
    ↓
Generate unique customUserId (ICTACEM2025-XXX)
    ↓
Hash password with bcrypt
    ↓
Save user to database
    ↓
Generate JWT token
    ↓
Set httpOnly cookie (jwt=token)
    ↓
Return user data + token to frontend
    ↓
Frontend stores user in AuthContext
    ↓
Redirect to profile/dashboard
```

#### 6.1.2 Login Flow

```
User submits credentials
    ↓
POST /api/auth/login
    ↓
Find user by email
    ↓
Compare password with bcrypt
    ↓
If valid: Generate JWT token
    ↓
Set httpOnly cookie
    ↓
Return user data (including role)
    ↓
Frontend updates AuthContext
    ↓
Redirect based on role (user → profile, admin → dashboard)
```

#### 6.1.3 Logout Flow

```
User clicks logout
    ↓
POST /api/auth/logout
    ↓
Clear jwt cookie (maxAge: 0)
    ↓
Frontend clears AuthContext
    ↓
Redirect to home
```

### 6.2 JWT Token Management

**Token Generation:**

```javascript
jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5d" });
```

**Token Storage:**

- Primary: httpOnly cookie (name: `jwt`)
- Fallback: localStorage (for environments with cookie issues)

**Cookie Options:**

```javascript
{
  httpOnly: true,                    // Prevents XSS attacks
  secure: NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'none' | 'lax',         // Cross-site policy
  path: '/',
  maxAge: 5 * 24 * 60 * 60 * 1000   // 5 days
}
```

### 6.3 Protected Route Middleware

**File:** `backend/middleware/auth.middleware.js`

**Flow:**

```
Request to protected endpoint
    ↓
Extract token from:
  1. Cookie (req.cookies.jwt)
  2. Authorization header (Bearer token)
  3. Fallback: localStorage token (sent in header)
    ↓
If no token: return 401 Unauthorized
    ↓
Verify token with jwt.verify()
    ↓
If invalid/expired: return 401
    ↓
If valid: decode userId from token
    ↓
Fetch user from database (exclude password)
    ↓
Attach user to request: req.user = user
    ↓
Call next() to proceed to route handler
```

**Usage in Routes:**

```javascript
// Protect single route
router.get("/profile", protect, getUserProfile);

// Protect all routes in a router
router.use(protect);
router.get("/papers", getUserPapers);
```

### 6.4 Role-Based Access Control

**Admin Check Pattern:**

```javascript
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
```

**Usage:**

```javascript
router.get("/admin/users", protect, adminOnly, getAllUsers);
```

### 6.5 Password Reset Flow

#### Request Reset

```
User enters email on forgot password page
    ↓
POST /api/auth/forgot-password
    ↓
Find user by email
    ↓
Generate reset token with crypto
    ↓
Hash token and save to user.resetPasswordToken
    ↓
Set expiry (user.resetPasswordExpire = now + 10 min)
    ↓
Send email with reset link:
  https://domain.com/reset-password/:resettoken
    ↓
Return success message
```

#### Reset Password

```
User clicks link in email
    ↓
Frontend navigates to /reset-password/:token
    ↓
User enters new password
    ↓
PUT /api/auth/reset-password/:resettoken
    ↓
Hash the token from URL
    ↓
Find user with matching hashed token
    ↓
Check if token not expired
    ↓
If valid: Update user password
    ↓
Clear resetPasswordToken and resetPasswordExpire
    ↓
Return success message
    ↓
Redirect to login
```

---

## 7. File Upload System (Detailed)

### 7.1 Multer Configuration

**File:** `backend/middleware/multer.js`

**Storage Strategy:**

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save to uploads directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    // Format: paper-{timestamp}-{random}.pdf
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "paper-" + uniqueSuffix + path.extname(file.originalname));
  },
});
```

**File Filter:**

```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept PDF only
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};
```

**Limits:**

```javascript
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
```

### 7.2 Abstract Submission Workflow

```
User fills abstract submission form
    ↓
Select PDF file (max 10MB)
    ↓
Frontend validation:
  - File type: PDF
  - File size: ≤ 10MB
  - Required fields present
    ↓
POST /api/papers/submit (multipart/form-data)
  - Form fields: title, authors, theme, etc.
  - File field: paperPdf
    ↓
Multer processes upload:
  - Validates file type
  - Generates unique filename
  - Saves to uploads/ directory
    ↓
Controller receives:
  - req.body (form fields)
  - req.file (uploaded file info)
    ↓
Create Paper document:
  - Basic info from form
  - pdfPath = req.file.path
  - Add to abstractSubmissionHistory
    ↓
Save to database
    ↓
Return success with paper ID
    ↓
Frontend redirects to profile
```

### 7.3 Full Paper Submission Workflow

```
User navigates to paper details
    ↓
Check if abstract approved
    ↓
If approved, show "Submit Full Paper" button
    ↓
User selects full paper PDF
    ↓
POST /api/papers/:id/full-paper
  - File field: fullPaperPdf
    ↓
Multer processes upload
    ↓
Update paper document:
  - fullPaperPdfPath = req.file.path
  - fullPaperSubmittedAt = Date.now()
  - Add to fullPaperSubmissionHistory
    ↓
Save to database
    ↓
Return success
```

### 7.4 Re-upload After Admin Reset

```
Admin clicks "Reset Abstract" on paper
    ↓
PATCH /admin/papers/:id/reset-abstract
    ↓
Set paper.abstractResetRequested = true
    ↓
Set paper.pdfPath = null (remove current)
    ↓
Save paper
    ↓
User sees "Re-upload Required" status
    ↓
User uploads new abstract
    ↓
POST /api/papers/:id/re-upload-abstract
    ↓
Process similar to initial submission
    ↓
Update paper:
  - pdfPath = new file path
  - abstractResetRequested = false
  - Add to history
    ↓
Save and return success
```

### 7.5 File Access & Security

**Viewing PDFs (In-Browser):**

```javascript
// Route: GET /api/papers/view/:id
router.get('/view/:id', protect, viewPaper);

// Controller:
- Check if user owns paper OR is admin
- Get paper from database
- Get file path
- Set headers:
  - Content-Type: application/pdf
  - Content-Disposition: inline
- Send file with res.sendFile()
```

**Downloading PDFs:**

```javascript
// Route: GET /api/papers/download/:id
router.get('/download/:id', protect, downloadPaper);

// Similar to view, but:
- Content-Disposition: attachment
- Triggers browser download
```

**Security Measures:**

1. **Authentication Required:** All paper file access requires valid JWT
2. **Authorization Check:** User must own paper OR be admin
3. **Path Validation:** Prevent directory traversal attacks
4. **File Type Restriction:** Only PDFs accepted
5. **Size Limits:** 10MB max per file
6. **Unique Filenames:** Prevents overwrites and collisions

---

## 8. Frontend Architecture (Detailed)

### 8.1 React Router Configuration

**Base Path:** `/ictacem2025` (for deployment under subdirectory)

**Route Structure:**

```jsx
<Router basename="/ictacem2025">
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/speakers" element={<Speakers />} />
    <Route path="/plenary-speakers" element={<PlenarySpeakers />} />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/important-dates" element={<ImportantDates />} />
    <Route path="/committee" element={<Committee />} />
    <Route path="/sponsors" element={<Sponsors />} />
    <Route path="/sponsorship" element={<Sponsorship />} />

    {/* Document Routes */}
    <Route path="/brouchure" element={<Brouchure />} />
    <Route path="/book-of-abstracts" element={<BookOfAbstracts />} />
    <Route
      path="/extended-abstract-format"
      element={<ExtendedAbstractFormat />}
    />
    <Route
      path="/full-length-paper-format"
      element={<FullLengthPaperFormat />}
    />
    <Route path="/payment-procedure" element={<PaymentProcedure />} />

    {/* Auth Routes */}
    <Route path="/register" element={<Registration />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {/* Protected Routes (require login) */}
    <Route path="/profile" element={<Profile />} />
    <Route path="/submit-paper" element={<SubmitPaper />} />
    <Route path="/submit-full-paper/:id" element={<SubmitFullPaper />} />
    <Route path="/notifications" element={<NotificationsPage />} />

    {/* Admin Routes (require admin role) */}
    <Route path="/admin" element={<Admin />} />
    <Route path="/admin/user/:id" element={<UserDetailsPage />} />
    <Route path="/admin/paper/:id" element={<PaperDetailsPage />} />
    <Route path="/admin/history/:id" element={<SubmissionHistoryModal />} />
  </Routes>
</Router>
```

### 8.2 Authentication Context

**File:** `client/src/context/AuthContext.jsx`

**Purpose:** Global authentication state management

**State:**

```javascript
{
  user: {
    _id: string,
    username: string,
    email: string,
    role: 'user' | 'admin',
    customUserId: string
  } | null,
  loading: boolean
}
```

**Methods:**

```javascript
// Login user (called after successful API login)
login(userData);

// Logout user (clear state and cookies)
logout();

// Check authentication status on app load
checkAuth();
```

**Usage in Components:**

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return <div>Welcome, {user.username}!</div>;
  }

  return <div>Please login</div>;
}
```

**Protected Route Pattern:**

```jsx
function ProtectedPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

### 8.3 Key Components (Detailed)

#### 8.3.1 Navbar Component

**File:** `client/src/components/Navbar.jsx`

**Features:**

- Responsive mobile menu (hamburger)
- Dynamic navigation based on auth state
- Shows different links for logged-in vs logged-out users
- Admin link only visible to admins
- User dropdown with profile/logout options
- Notification bell with unread count
- Smooth transitions and animations

**Structure:**

```jsx
<nav>
  <Logo />
  <DesktopMenu>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/speakers">Speakers</NavLink>
    <Dropdown title="Resources">
      <DropdownItem to="/brouchure">Brochure</DropdownItem>
      <DropdownItem to="/schedule">Schedule</DropdownItem>
      ...
    </Dropdown>
    {user ? (
      <>
        <NavLink to="/profile">Profile</NavLink>
        {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        <UserMenu user={user} onLogout={logout} />
      </>
    ) : (
      <>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
      </>
    )}
  </DesktopMenu>
  <MobileMenu />
</nav>
```

#### 8.3.2 HeroSection Component

**File:** `client/src/components/HeroSection.jsx`

**Features:**

- Conference title and dates
- Animated gradient backgrounds
- Important announcements (technical schedule, venue map)
- Call-to-action buttons
- Responsive design with parallax effects
- Icon integration (Remix Icons)

**Key Sections:**

```jsx
<HeroSection>
  {/* Main Title */}
  <h1>ICTACEM-2025</h1>
  <p>
    International Conference on Theoretical Applied Computational and
    Experimental Mechanics
  </p>

  {/* Date & Venue */}
  <div>December 15-17, 2025</div>
  <div>IIT Kharagpur</div>

  {/* Announcements */}
  <AnnouncementCard type="schedule">
    <h4>Technical Schedule Released</h4>
    <p>View the technical schedule for ICTACEM 2025</p>
    <Button onClick={() => navigate("/book-of-abstracts")}>
      View Technical Schedule
    </Button>
  </AnnouncementCard>

  <AnnouncementCard type="map">
    <h4>Venue Map Available</h4>
    <p>Download the venue map to navigate the conference location</p>
    <a href="/ictacem2025/api/documents/ICTACEM2025_Map.pdf" download>
      Download Map
    </a>
  </AnnouncementCard>

  {/* CTA Buttons */}
  <Button to="/register">Register Now</Button>
  <Button to="/submit-paper">Submit Paper</Button>
</HeroSection>
```

#### 8.3.3 BookOfAbstracts Component

**File:** `client/src/pages/BookOfAbstracts.jsx`

**Purpose:** Display both Technical Schedule and Book of Abstracts PDFs

**State Management:**

```javascript
const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
const [errorSchedule, setErrorSchedule] = useState(false);
const [isLoadingBook, setIsLoadingBook] = useState(true);
const [errorBook, setErrorBook] = useState(false);
```

**PDF Paths:**

```javascript
const schedulePath = "/ictacem2025/api/documents/Technical Schedule.pdf";
const bookPath = "/ictacem2025/api/documents/Book of abstracts.pdf";
```

**Structure:**

```jsx
<BookOfAbstracts>
  {/* Header */}
  <Header>
    <Icons>
      <CalendarIcon />
      <BookIcon />
    </Icons>
    <h1>Technical Schedule & Book of Abstracts</h1>
  </Header>

  {/* Action Buttons */}
  <ButtonGroup>
    <Button onClick={handleScheduleDownload}>Download Schedule</Button>
    <Button onClick={handleBookDownload}>Download Book of Abstracts</Button>
    <Button onClick={() => window.open(schedulePath)}>Open in New Tab</Button>
  </ButtonGroup>

  {/* Info Cards */}
  <InfoCards>
    <Card icon={<Calendar />} title="Session Schedule">
      ...
    </Card>
    <Card icon={<FileText />} title="Paper Abstracts">
      ...
    </Card>
    <Card icon={<Presentation />} title="Presentations">
      ...
    </Card>
  </InfoCards>

  {/* PDF Viewer - Technical Schedule */}
  <PDFViewer>
    {isLoadingSchedule && <LoadingSpinner />}
    {errorSchedule && <ErrorMessage />}
    {!errorSchedule && (
      <iframe
        src={schedulePath}
        title="Technical Schedule"
        onLoad={handleSchedulePdfLoad}
        onError={handleSchedulePdfError}
      />
    )}
  </PDFViewer>

  {/* PDF Viewer - Book of Abstracts */}
  <PDFViewer>
    {isLoadingBook && <LoadingSpinner />}
    {errorBook && <ErrorMessage />}
    {!errorBook && (
      <iframe
        src={bookPath}
        title="Book of Abstracts"
        onLoad={handleBookPdfLoad}
        onError={handleBookPdfError}
      />
    )}
  </PDFViewer>

  {/* Additional Info */}
  <InfoSection>...</InfoSection>
  <ContactSection>...</ContactSection>
</BookOfAbstracts>
```

#### 8.3.4 PlenarySpeakers Component

**File:** `client/src/pages/PlenarySpeakers.jsx`

**Features:**

- Displays speaker list sorted alphabetically by surname
- Chief Guest highlighted at top with gold styling
- Profile links for each speaker
- Responsive grid layout
- Animated cards with hover effects

**Speaker Sorting Logic:**

```javascript
// Extract surname from full name
const getSurname = (fullName) => {
  const cleaned = fullName.replace(/^(Prof\.|Dr\.)\s*/i, "").trim();
  const parts = cleaned.split(/\s+/);
  return parts[parts.length - 1].toLowerCase();
};

// Separate chief guest and sort others
const chiefGuest = plenarySpeakers.find((s) => s.designation === "Chief Guest");
const otherSpeakers = plenarySpeakers.filter(
  (s) => s.designation !== "Chief Guest"
);
const sortedOthers = otherSpeakers.sort((a, b) =>
  getSurname(a.name).localeCompare(getSurname(b.name))
);

// Final sorted list: chief guest first, then others alphabetically
const sortedSpeakers = chiefGuest
  ? [chiefGuest, ...sortedOthers]
  : sortedOthers;
```

**Card Styling:**

```jsx
<SpeakerCard className={isChiefGuest ? "chief-guest-card" : ""}>
  {/* Chief Guest gets special gold gradient */}
  <TopBar className={isChiefGuest ? "gold-gradient" : "normal-gradient"} />

  <h3 className={isChiefGuest ? "gold-text" : ""}>{speaker.name}</h3>

  {speaker.designation && (
    <Badge className={isChiefGuest ? "chief-guest-badge" : "speaker-badge"}>
      {isChiefGuest ? "Chief Guest" : "Plenary Speaker"}
    </Badge>
  )}

  <Affiliation>{speaker.affiliation}</Affiliation>

  {speaker.websiteLink && (
    <ProfileLink href={speaker.websiteLink} target="_blank">
      View Profile <ExternalLinkIcon />
    </ProfileLink>
  )}
</SpeakerCard>
```

#### 8.3.5 Profile/Dashboard Component

**File:** `client/src/pages/Profile.jsx`

**Features:**

- User information display
- Submitted papers list
- Paper status indicators
- Upload/re-upload functionality
- Payment ID update
- Full paper submission

**Structure:**

```jsx
<Profile>
  <UserInfo>
    <h2>Welcome, {user.username}</h2>
    <p>Email: {user.email}</p>
    <p>User ID: {user.customUserId}</p>
  </UserInfo>

  <ActionButtons>
    <Button to="/submit-paper">Submit New Abstract</Button>
    <Button to="/notifications">View Notifications</Button>
  </ActionButtons>

  <PapersSection>
    <h3>Your Submissions</h3>
    {papers.map((paper) => (
      <PaperCard key={paper._id}>
        <Title>{paper.title}</Title>
        <Status status={paper.status}>{paper.status}</Status>

        <Actions>
          <Button onClick={() => viewPDF(paper._id)}>View Abstract</Button>

          {paper.fullPaperPdfPath && (
            <Button onClick={() => viewFullPaper(paper._id)}>
              View Full Paper
            </Button>
          )}

          {paper.abstractResetRequested && (
            <Button onClick={() => reUploadAbstract(paper._id)}>
              Re-upload Abstract
            </Button>
          )}

          {paper.status === "approved" && !paper.fullPaperPdfPath && (
            <Button to={`/submit-full-paper/${paper._id}`}>
              Submit Full Paper
            </Button>
          )}

          {!paper.paymentId && (
            <PaymentForm onSubmit={(id) => updatePayment(paper._id, id)} />
          )}
        </Actions>
      </PaperCard>
    ))}
  </PapersSection>
</Profile>
```

#### 8.3.6 Admin Dashboard Component

**File:** `client/src/pages/Admin.jsx`

**Features:**

- Statistics overview
- User management table
- Paper management table with filters
- Status update controls
- Submission settings toggle
- Search and pagination

**Structure:**

```jsx
<AdminDashboard>
  {/* Statistics Cards */}
  <StatsGrid>
    <StatCard icon={<Users />} value={stats.totalUsers} label="Total Users" />
    <StatCard
      icon={<FileText />}
      value={stats.totalPapers}
      label="Total Papers"
    />
    <StatCard
      icon={<CheckCircle />}
      value={stats.approvedPapers}
      label="Approved"
    />
    <StatCard icon={<Clock />} value={stats.pendingPapers} label="Pending" />
  </StatsGrid>

  {/* Tabs */}
  <Tabs>
    <Tab label="Papers" active={activeTab === "papers"}>
      <PapersTable>
        <Filters>
          <Select onChange={filterByStatus}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select onChange={filterByTheme}>...</Select>
          <SearchInput onChange={search} placeholder="Search..." />
        </Filters>

        <Table>
          {papers.map((paper) => (
            <Row key={paper._id}>
              <Cell>{paper.title}</Cell>
              <Cell>{paper.user.email}</Cell>
              <Cell>
                <StatusBadge status={paper.status} />
              </Cell>
              <Cell>
                <Button onClick={() => viewPaper(paper._id)}>View</Button>
                <Button onClick={() => updateStatus(paper._id)}>Update</Button>
                <Button onClick={() => resetAbstract(paper._id)}>Reset</Button>
              </Cell>
            </Row>
          ))}
        </Table>

        <Pagination />
      </PapersTable>
    </Tab>

    <Tab label="Users">
      <UsersTable>...</UsersTable>
    </Tab>

    <Tab label="Settings">
      <SettingsForm>
        <Toggle
          label="Allow Abstract Submissions"
          checked={settings.abstractSubmissionsOpen}
          onChange={updateSettings}
        />
        <Toggle
          label="Allow Full Paper Submissions"
          checked={settings.fullPaperSubmissionsOpen}
          onChange={updateSettings}
        />
      </SettingsForm>
    </Tab>
  </Tabs>
</AdminDashboard>
```

### 8.4 HTTP Client Configuration

**Using Axios:**

```javascript
import axios from "axios";

// Base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (add auth token from localStorage if exists)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle auth errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 8.5 Styling Approach

**Tailwind CSS:**

- Utility-first CSS framework
- Custom theme configuration
- Responsive design classes
- Dark mode support (optional)

**Common Patterns:**

```jsx
// Gradient backgrounds
className = "bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700";

// Card styling
className = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";

// Button styling
className =
  "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl";

// Responsive grid
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
```

**Custom CSS:**

- File: `client/src/App.css` and `client/src/index.css`
- Used for complex animations and transitions
- Global styles and resets

---
