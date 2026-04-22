# 🎬 CineVerse

A Netflix-style movie streaming web app built with React and Node.js.

## Features
- Browse movies and TV series
- Watch trailers
- Stream movies
- Watchlist
- Search functionality
- Mobile responsive

## Tech Stack
- Frontend: React.js + Tailwind CSS + Vite
- Backend: Node.js + Express
- API: TMDB API

## Setup

### Frontend
cd frontend
npm install
npm run dev

### Backend
cd backend
npm install
node server.js

## Environment Variables

### Frontend (.env)
VITE_TMDB_API_KEY=your_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
VITE_TMDB_BACKDROP_BASE=https://image.tmdb.org/t/p/original
VITE_BACKEND_URL=http://localhost:5000

### Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
