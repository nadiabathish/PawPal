import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

// GET /settings/:userId: - Fetch profile settings for a user
router.get("/settings/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const settings = await knex("settings").where({ user_id: userId }).first();
    if (!settings) return res.status(404).send("Settings not found");
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings: ", error);
    res.status(500).send("Error fetching settings");
  }
});

// PUT /settings/:userId: - Update profile settings for a user
router.put("/settings/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;

  try {
    await knex("settings")
      .where({ user_id: userId })
      .update({ 
        preferences,
        updated_at: knex.fn.now(),
      });
    res.status(200).send("Settings updated successfully");
  } catch (error) {
    console.error("Error updating settings: ", error);
    res.status(500).send("Error updating settings");
  }
});

export default router;
