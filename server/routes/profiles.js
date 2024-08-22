import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

// GET /profile/:userId: - Fetch profile data for a specific user
router.get("/profile/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await knex("users")
    .where({ id: userId })
    .first();
    const dogProfile = await knex("dog_profiles")
    .where({ owner_id: userId })
    .first();

    if (!profile || !dogProfile) return res.status(404).send("Profile not found");

    let playStyles = [];

    if (typeof dogProfile.play_styles === 'string') {
      playStyles = dogProfile.play_styles.split(',');
    } else if (Array.isArray(dogProfile.play_styles)) {
      playStyles = dogProfile.play_styles;
    }
    res.status(200).json({
      email: profile.email,
      owner_name: profile.owner_name,
      dog_name: dogProfile.dog_name,
      dog_age: dogProfile.dog_age,
      dog_breed: dogProfile.dog_breed,
      play_styles: playStyles,
      profile_picture_url: dogProfile.profile_picture_url,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Error fetching profile");
  }
});

// PUT /profile/:userId: - Update the user's profile
router.put("/profile/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { email, owner_name } = req.body;

  try {
    await knex("users")
    .where({ id: userId })
    .update({ 
      email, 
      owner_name,
      updated_at: knex.fn.now(),
    });
    res.status(200).send("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile: ", error);
    res.status(500).send("Error updating profile");
  }
});

export default router;
