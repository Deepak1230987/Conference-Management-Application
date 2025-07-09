# Forgot Password Feature Documentation

## Overview

This implementation adds complete "Forgot Password" functionality to your conference website, allowing users to reset their passwords via email.

## Features Added

### 1. Backend Implementation

- **New Database Fields**: Added `resetPasswordToken` and `resetPasswordExpire` to the User model
- **Email Integration**: Added nodemailer for sending password reset emails
- **Security**: Tokens are hashed and expire after 10 minutes
- **New API Endpoints**:
  - `POST /api/auth/forgot-password` - Request password reset
  - `PUT /api/auth/reset-password/:resettoken` - Reset password with token

### 2. Frontend Implementation

- **ForgotPassword Page**: Clean interface for entering email
- **ResetPassword Page**: Form for setting new password
- **Enhanced Login Page**: Added "Forgot your password?" link and success message display
- **Updated Routing**: Added routes for new pages

## Setup Instructions

### 1. Backend Configuration

1. **Install Dependencies** (already done):

   ```bash
   npm install nodemailer crypto
   ```

2. **Environment Variables**: Add to your `.env` file:

   ```env
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

3. **Gmail Setup** (if using Gmail):
   - Enable 2-factor authentication on your Gmail account
   - Generate an "App Password" in Google Account settings
   - Use the app password as `SMTP_PASS` (not your regular password)

### 2. Frontend Configuration

No additional configuration needed - routes and components are already integrated.

## How It Works

### User Flow

1. **Forgot Password Request**:

   - User clicks "Forgot your password?" on login page
   - Enters email address on forgot password page
   - Receives email with reset link

2. **Password Reset**:
   - User clicks link in email (contains secure token)
   - Enters new password on reset page
   - Password is updated and user is redirected to login

### Security Features

- **Token Expiration**: Reset tokens expire after 10 minutes
- **Token Hashing**: Tokens are cryptographically hashed in database
- **One-time Use**: Tokens are deleted after successful password reset
- **Email Validation**: Only registered email addresses can request resets

## Email Template

The reset email includes:

- Clear subject line: "Password Reset Request"
- Branded HTML template with conference styling
- Secure reset link with embedded token
- 10-minute expiration notice
- Instructions for ignoring if not requested

## API Endpoints

### POST /api/auth/forgot-password

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Response (User Not Found)**:

```json
{
  "success": false,
  "message": "There is no user with that email"
}
```

### PUT /api/auth/reset-password/:resettoken

**Request Body**:

```json
{
  "password": "newpassword123"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "_id": "userId",
  "username": "username",
  "email": "user@example.com",
  "role": "user"
}
```

**Response (Invalid/Expired Token)**:

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Testing

### Manual Testing Steps

1. **Test Forgot Password**:

   - Go to `/login`
   - Click "Forgot your password?"
   - Enter valid email address
   - Check email for reset link

2. **Test Password Reset**:

   - Click reset link from email
   - Enter new password (min 6 characters)
   - Confirm password matches
   - Submit form
   - Verify redirect to login with success message

3. **Test Edge Cases**:
   - Try invalid email (should show error)
   - Try expired token (should show error)
   - Try mismatched passwords (should show error)

## Troubleshooting

### Common Issues

1. **Email Not Sending**:

   - Check SMTP credentials in `.env`
   - Verify Gmail app password if using Gmail
   - Check server logs for email errors

2. **Reset Link Not Working**:

   - Ensure frontend and backend URLs match
   - Check token expiration (10 minutes)
   - Verify token is correctly embedded in URL

3. **CORS Issues**:
   - Ensure frontend URL is allowed in CORS settings
   - Check that cookies are being sent with requests

## File Structure

```
backend/
├── controller/auth.controller.js (updated)
├── models/user.model.js (updated)
├── routes/auth.route.js (updated)
└── .env.example (created)

client/src/
├── pages/
│   ├── Login.jsx (updated)
│   ├── ForgotPassword.jsx (new)
│   └── ResetPassword.jsx (new)
└── App.jsx (updated)
```

## Future Enhancements

- Add rate limiting for password reset requests
- Implement password strength requirements
- Add password reset history/audit log
- Add email templates for different languages
- Implement account lockout after multiple failed attempts
