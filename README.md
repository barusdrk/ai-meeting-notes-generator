# AI Meeting Notes Generator

AI Meeting Notes Generator is a full-stack AI application that converts raw meeting transcripts into structured meeting notes using OpenAI.

Users can:

- Paste meeting transcripts
- Upload PDF, DOCX, or TXT transcripts
- Generate AI meeting summaries
- View decisions
- View action items
- View assigned tasks
- Copy results to clipboard
- Export results to PDF
- Export results to Microsoft Word
- Create an account and log in
- Use Dark Mode

---

### Demo Mode

For demonstration purposes, the project supports mocked AI responses.

---

# Features

## AI Meeting Notes

Generate structured meeting notes from long transcripts.

Output includes:

- Summary
- Decisions
- Action Items
- Assigned Tasks

---

## File Upload

Supported formats:

- TXT
- DOCX
- PDF

---

## Authentication

JWT authentication

- Register
- Login
- Logout
- Protected API routes

Passwords are securely hashed using bcrypt.

---

## Export

Export generated meeting notes to:

- PDF
- Microsoft Word (.docx)

---

## Clipboard

Copy the generated meeting notes with one click.

---

## Dark Mode

Switch between Light and Dark themes.

Theme preference is saved in localStorage.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Router

## Backend

- Node.js
- Express
- TypeScript
- OpenAI API
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

---

# Project Structure

```
meeting-notes-generator/

├── client/
│
│   ├── src/
│   │
│   ├── components/
│   │
│   ├── context/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   └── main.tsx
│
└── server/
    ├── src/
    │
    ├── middleware/
    ├── models/
    ├── prompts/
    ├── routes/
    ├── services/
    ├── types/
    │
    └── index.ts
```

---

# Installation

## Clone

```bash
git clone https://github.com/barusdrk/ai-meeting-notes-generator.git

cd ai-meeting-notes-generator
```

---

## Client

```bash
cd client

npm install
```

---

## Server

```bash
cd ../server

npm install
```

---

# Environment Variables

Create:

```
server/.env
```

Example:

```env
OPENAI_API_KEY=your_openai_api_key

JWT_SECRET=replace_with_a_secure_random_secret

MONGODB_URI=mongodb://localhost:27017/meeting-notes

PORT=3001
```

---

# Running

Terminal 1

```bash
cd server

npm run dev
```

Terminal 2

```bash
cd client

npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:3001
```

---

# API

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Current User

```
GET /api/auth/me
```

---

## Upload

```
POST /api/upload
```

Supported:

- txt
- docx
- pdf

---

## Summarize

```
POST /api/summarize
```

Produces:

```json
{
  "summary": "...",
  "decisions": [],
  "actionItems": [],
  "tasks": []
}
```

---

# Learning Achievements

This project demonstrates:

- OpenAI Responses API
- Long-context prompting
- Structured JSON output
- JWT authentication
- MongoDB integration
- File uploads
- PDF parsing
- DOCX parsing
- React Context
- Protected routes
- REST APIs
- TypeScript
- Tailwind CSS
- Exporting PDF
- Exporting DOCX

---

## Author

Derek Barus

GitHub: https://github.com/barusdrk
