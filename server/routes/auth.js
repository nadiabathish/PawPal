import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/authenticateToken.js";
// import multer from "multer";

const knex = initKnex(configuration);
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('profile_pictures', 10); // Allow up to 10 images

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}



// GET /verify-token - Verify if the JWT token is valid
router.get('/verify-token', authenticateToken, (req, res) => {
  // Respond with a success message if the token is valid
  res.status(200).json({ message: "Token is valid" });
});


// POST /signup - Register a new user and their dog profile
router.post("/signup", upload, async (req, res) => {
  // Extract user and dog information from the request body
  const { email, password, name, dog_name, dog_age, dog_breed, play_styles } = req.body;

  // Validate that all required fields are present
  if (!email || !password || !name || !dog_name || !dog_age || !dog_breed || !play_styles) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Check if the user with the provided email already exists
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the "users" table and get the generated user ID
    const [userId] = await knex("users").insert({
      email,
      password: hashedPassword,
      name,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    // Get the uploaded file paths
    const profilePictures = req.files.map(file => file.path);

    // Insert the new user's dog profile into the "dog_profiles" table
    await knex("dog_profiles").insert({
      dog_name,
      dog_age,
      dog_breed,
      play_styles: JSON.stringify(play_styles), // Convert play_styles to JSON string before saving
      profile_pictures: JSON.stringify(profilePictures), // Save file paths as JSON string
      owner_id: userId,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Respond with the token and success message
    res.status(201).json({ token, message: "User and dog profile registered successfully" });
  } catch (error) {
    // Log the error and respond with a 500 status if registration fails
    console.error("Error registering user: ", error);
    res.status(500).send("Error registering user");
  }
});


// POST /login - Authenticate a user and return their JWT token and profile data
router.post("/login", async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Validate that email and password fields are present
  if (!email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Check if the user exists by searching for their email in the database
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Fetch the user's associated dog profile from the database
    const dogProfile = await knex("dog_profiles").where({ owner_id: user.id }).first();

    // Respond with the token, user information, dog profile data, and a success message
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      dogProfile: dogProfile ? {
        dog_name: dogProfile.dog_name,
        dog_age: dogProfile.dog_age,
        dog_breed: dogProfile.dog_breed,
        play_styles: dogProfile.play_styles, // Ensure play_styles is sent as is
        profile_pictures: dogProfile.profile_pictures  // Include profile pictures if available
      } : null,
      message: "Login successful"
    });
  } catch (error) {
    // Log the error and respond with a 500 status if login fails
    console.error("Error logging in: ", error);
    res.status(500).send("Error logging in");
  }
});

export default router;