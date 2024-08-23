import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();

// PUT / - Handle a mutual "like" and update the match status if necessary
router.put('/', authenticateToken, async (req, res) => {
  // Extract the userId from the authentication token and likedDogId from the request body
  const userId = req.user.userId;
  const { likedDogId } = req.body;

  try {
    // Fetch the dog profile of the liked dog to find its owner
    const likedDogProfile = await knex('dog_profiles').where({ id: likedDogId }).first();
    const likedUserId = likedDogProfile.owner_id;

    // Check if there is an existing "pending" match initiated by the liked dog owner
    const existingMatch = await knex('matches')
      .where({
        user1_id: likedUserId,
        user2_id: userId,
        status: 'pending'
      })
      .first();

    // If a pending match exists, update it to "matched" and insert a new mutual match entry
    if (existingMatch) {
      // Update the status of the existing match to "matched"
      await knex('matches').where({ id: existingMatch.id }).update({ status: 'matched' });

      // Insert a new match entry indicating the mutual like and matching status
      await knex('matches').insert({
        user1_id: userId,
        user2_id: likedUserId,
        status: 'matched'
      });

      return res.status(200).send("It's a match!");
    }

    // Respond with an error if no pending match was found
    res.status(400).send("No pending match found.");
  } catch (error) {
    // Log the error and respond with a 500 status if an error occurs
    console.error("Error handling mutual like: ", error);
    res.status(500).send("Error handling mutual like");
  }
});

// GET /check-match - Check if two users have a mutual match
router.get('/check-match', authenticateToken, async (req, res) => {
  // Extract the userId from the authentication token and the other user's ID from the query parameters
  const userId = req.user.userId;
  const { otherUserId } = req.query;

  try {
    // Query the 'playmates' table to check if both users have liked each other's profiles and are marked as "matched"
    const mutualMatch = await knex('playmates')
      .where(function () {
        // Check if user1 liked user2 and the match is confirmed
        this.where('dog_id', userId).andWhere('user_id', otherUserId).andWhere('matched', 1);
      })
      .orWhere(function () {
        // Check if user2 liked user1 and the match is confirmed
        this.where('dog_id', otherUserId).andWhere('user_id', userId).andWhere('matched', 1);
      })
      .count('* as count'); // Count the number of matches found

    // If both users have mutually liked each other, return matched: true
    if (mutualMatch[0].count === 2) {
      res.status(200).json({ matched: true });
    } else {
      // Otherwise, return matched: false
      res.status(200).json({ matched: false });
    }
  } catch (error) {
    // Log the error and respond with a 500 status if an error occurs
    console.error('Error checking mutual match:', error);
    res.status(500).send('Error checking mutual match');
  }
});



export default router;
  