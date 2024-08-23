import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();

// GET /notifications - Fetch dog profiles that have liked the user's dog profile and are pending.
router.get('/', authenticateToken, async (req, res) => {
  // Retrieve the current user's ID from the authentication token
  const userId = req.user.userId;

  try {
    // Query the 'matches' table to find all dog profiles where the user's profile has been "liked" and the like status is still pending (i.e., the user has not yet responded).
    const notifications = await knex('matches')
      .join('dog_profiles', 'matches.user1_id', '=', 'dog_profiles.owner_id') // Join the 'dog_profiles' table to retrieve the liked dog's profile info
      .select(
        'dog_profiles.id as dog_id',              // Select the dog profile ID
        'dog_profiles.dog_name',                  // Select the dog's name
        'dog_profiles.dog_breed',                 // Select the dog's breed
        'dog_profiles.profile_pictures',          // Select the dog's profile picture(s)
        'matches.id as match_id',                 // Select the match record ID
        'matches.status'                          // Select the status of the match (should be 'pending')
      )
      .where('matches.user2_id', userId)          // Filter to get matches where the current user is the one being "liked"
      .andWhere('matches.status', 'pending');     // Ensure the match is still pending

    // Respond with the list of pending notifications (profiles that liked the user's dog)
    res.status(200).json(notifications);
  } catch (error) {
    // Log any errors and respond with a 500 status if the query fails
    console.error("Error fetching notifications: ", error);
    res.status(500).send("Error fetching notifications");
  }
});

export default router;
