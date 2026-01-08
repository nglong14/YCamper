# 🏕️ YelpCamp

A full-stack web application for discovering, sharing, and reviewing campgrounds around the world. Built with React and Node.js.

## ✨ Features

- **Browse Campgrounds**: Explore a collection of campgrounds with images, locations, and descriptions
- **User Authentication**: Secure registration and login system
- **Create & Edit**: Add new campgrounds or edit your own listings
- **Reviews & Ratings**: Leave reviews and rate campgrounds with a 5-star system
- **Interactive Maps**: View campground locations on an interactive map
- **AI-Powered Guides**: Get personalized activity suggestions for each location

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Vite
- MapTiler SDK

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Passport.js (Local Strategy)
- Cloudinary (Image Upload)
- Google Gemini AI
- Joi (Validation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Cloudinary account (for image uploads)
- Google Gemini API key (optional, for AI guides)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Yelpcamp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running locally
   mongod
   ```

6. **Run the application**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   node index.js
   ```
   Backend runs on `http://localhost:3000`
   
   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
Yelpcamp/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routers/         # API routes
│   ├── middleware/      # Authentication & validation
│   ├── utils/           # Helper utilities
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in to access all features
2. **Browse**: View all available campgrounds on the main page
3. **Explore**: Click on any campground to see details, reviews, and location
4. **Contribute**: Add your own campground or leave reviews
5. **Manage**: Edit or delete campgrounds you've created

## 🔒 Security

- Passport.js authentication with bcrypt password hashing
- Session-based authentication
- Middleware-protected routes
- Input validation with Joi schemas
- CORS configured for secure cross-origin requests

## 📝 License

ISC

---


