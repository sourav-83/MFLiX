require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Your existing database connection module
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(
  cors({
    origin: ["http://localhost:3000", "http://10.18.115.237:3000"], // Your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// --- JWT Helper Functions (kept here as they are general utilities) ---
const generateToken = (user) => {
  return jwt.sign(
    {
      userID: user.userid,
      userType: user.usertype,
      username: user.username, // ADDED: Include username in the JWT payload
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// --- JWT Authentication Middleware (kept here as they are general utilities) ---
const authenticateToken = (req, res, next) => {
  console.log("=== Authentication Debug ===");
  console.log("Authorization header:", req.headers.authorization);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log("Token from header:", token);

  if (!token) {
    console.log("No token found in Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("Token verified successfully for user:", user.userID);
    req.user = user;
    next();
  });
};

const authenticateOptionalToken = (req, _res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];     // Bearer TOKEN

  if (!token) {
    req.user = null;      // guest
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Invalid token → treat as guest (do NOT throw 403 here)
      req.user = null;
    } else {
      req.user = user;    // signed‑in user payload
    }
    next();
  });
};

// --- Import Route Modules ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const movieRoutes = require("./routes/movieRoutes");
const actorRoutes = require("./routes/actorRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const castRatingRoutes = require("./routes/castRatingRoutes");
const adminRoutes = require("./routes/adminRoutes");

// --- Mount Route Modules ---
// Pass db and authentication middleware to route modules
app.use("/api/auth", authRoutes({ db, generateToken, authenticateToken }));
app.use("/api/user", userRoutes({ db, authenticateToken }));
app.use("/api/reviews", reviewRoutes({ db, authenticateToken }));
app.use("/api/movies", movieRoutes({ db, authenticateOptionalToken }));
app.use("/api/actors", actorRoutes({ db })); // Actors don't seem to need auth middleware directly on their routes
app.use("/api/watchlist", watchlistRoutes({ db, authenticateToken }));
app.use("/api/users/watchlist", watchlistRoutes({ db, authenticateToken })); // Watchlist GET also uses this path
app.use("/api/cast", castRatingRoutes({ db, authenticateToken }));
app.use("/api/top-picks", movieRoutes({ db, authenticateOptionalToken })); // Top picks is part of movie logic
app.use("/api/user/admin", adminRoutes({ db, authenticateToken })); // Admin routes

// --- Server Start ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
