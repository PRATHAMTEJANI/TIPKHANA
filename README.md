# Personal Cloud Storage Web Application

A full-stack personal cloud storage solution built with React, Node.js, and Firebase.

## Features

- 🔐 **Authentication**: Secure user login/signup with Firebase Auth
- 📁 **File Management**: Upload, download, delete, and preview files
- 🔍 **Search**: Find files quickly with search functionality
- 📱 **Responsive**: Works on desktop and mobile devices
- 🚀 **Real-time**: Live updates with Firebase
- 📊 **Progress Tracking**: Upload progress bars for better UX

## Tech Stack

- **Frontend**: React 18 + TailwindCSS
- **Backend**: Node.js + Express
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Deployment**: Vercel (Frontend) + Render (Backend)

## Project Structure

```
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .env.example           # Environment variables template
├── package.json           # Root package.json
└── README.md             # This file
```

## Prerequisites

- Node.js 16+ and npm
- Firebase account
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd personal-cloud-storage
npm run install-all
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Set up Firebase Storage
6. Get your project configuration

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase project details.

### 4. Run Development Server

```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000).

## API Endpoints

- `POST /api/upload` - Upload files
- `GET /api/files` - Get user's files
- `GET /api/file/:id` - Get file download URL
- `DELETE /api/file/:id` - Delete file

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render)

1. Connect GitHub repository to Render
2. Set environment variables
3. Deploy as a web service

## Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Config
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Server Config
PORT=5000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
