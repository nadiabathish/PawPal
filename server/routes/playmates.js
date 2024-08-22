import express from 'express';
import initKnex from 'knex';
import configuration from '../knexfile.js';
import authenticateToken from '../middleware/authenticateToken.js';

const knex = initKnex(configuration);
const router = express.Router();

// GET /playmates: - Get dog profiles for matching (exclude user's own dog and already liked/passed dogs)
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const playmates = await knex("dog_profiles")
    .whereNot("owner_id", userId)
    .whereNotExists(function () {
      this.select("*")
      .from("playmates")
      .whereRaw("playmates.dog_id = dog_profiles.id")
      .andWhere("playmates.user_id", userId);
    })
    .select(
      "id", 
      "dog_name as name", 
      "dog_age as age", 
      "dog_breed as breed", 
      "play_styles", 
      "profile_picture_url as image"
    );
    res.status(200).json(playmates);
    } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).send("Error fetching profiles");
  }
});

// POST /playmates/like: - Handle a 'like' action for a dog profile
router.post("/like", authenticateToken, async (req, res) => {
  const { dogId } = req.body;
  const userId = req.user.userId;

  try {
    await knex("playmates").insert({
      dog_id: dogId,
      user_id: userId,
      status: "liked",
      created_at: knex.fn.now(),
    });
    res.status(200).send(`Dog profile ${dogId} liked`);
  } catch (error) {
    console.error("Error liking dog profile:", error);
    res.status(500).send("Error liking dog profile");
  }
});

// POST /playmates/pass: - Handle a 'pass' action for a dog profile
router.post("/pass", authenticateToken, async (req, res) => {
  const { dogId } = req.body;
  const userId = req.user.userId;

  try {
    await knex("playmates").insert({
      dog_id: dogId,
      user_id: userId,
      status: "passed",
      created_at: knex.fn.now(),
    });

    res.status(200).send(`Dog profile ${dogId} passed`);
  } catch (error) {
    console.error("Error passing dog profile:", error);
    res.status(500).send("Error passing dog profile");
  }
});

router.get('/matches/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const matches = await knex('playmates')
      .join('dog_profiles', 'playmates.dog_id', '=', 'dog_profiles.id')
      .join('users', 'dog_profiles.owner_id', '=', 'users.id')
      .where('playmates.user_id', userId)
      .andWhere('playmates.matched', 1)
      .select(
        'users.id as user_id', 
        'dog_profiles.dog_name', 
        'users.owner_name as user_name', 
        'dog_profiles.profile_picture_url'
      );

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).send('Error fetching matches');
  }
});

router.post('/action', authenticateToken, async (req, res) => {
  const { dogId, action } = req.body;
  const userId = req.user.userId;

  try {
    if (action === 'like') {
    } else if (action === 'pass') {
      // *** ADD: Handle pass logic
    }
    res.status(200).send('Action performed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error performing action');
  }
});

export default router;
