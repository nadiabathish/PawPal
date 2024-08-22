import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/authenticateToken.js";
import multer from "multer";
import path from "path";

const knex = initKnex(configuration);
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

router.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

router.post("/signup", async (req, res) => {
  const { email, password, owner_name, dog_name, dog_age, dog_breed, play_styles } = req.body;

  if (!email || !password || !owner_name || !dog_name || !dog_age || !dog_breed || !play_styles) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await knex("users").insert({
      email,
      password: hashedPassword,
      owner_name,
    });
    await knex("dog_profiles").insert({
      dog_name,
      dog_age,
      dog_breed,
      play_styles: play_styles.join(','),
      owner_id: userId,
    });

    res.status(201).send("User and dog profile created successfully!");
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).send("Error registering user");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing required fields");
  }
  try {
    const user = await knex("users").where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).send("Error logging in");
  }
});

export default router;
