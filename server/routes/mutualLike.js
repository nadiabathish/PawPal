import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();

router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { likedDogId } = req.body;

  try {
    // Fetch the liked dog's profile owner
    const likedDogProfile = await knex('dog_profiles').where({ id: likedDogId }).first();
    const likedUserId = likedDogProfile.owner_id;

    // Check if there is already a pending match
    const existingMatch = await knex('matches')
      .where({
        user1_id: likedUserId,
        user2_id: userId,
        status: 'pending'
      })
      .first();

    if (existingMatch) {
      // Update the existing match to "matched"
      await knex('matches').where({ id: existingMatch.id }).update({ status: 'matched' });

      // Insert the mutual like with "matched" status
      await knex('matches').insert({
        user1_id: userId,
        user2_id: likedUserId,
        status: 'matched'
      });

      return res.status(200).send("It's a match!");
    }

    res.status(400).send("No pending match found.");
  } catch (error) {
    console.error("Error handling mutual like: ", error);
    res.status(500).send("Error handling mutual like");
  }
});


router.get('/check-match', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { otherUserId } = req.query;

  try {
    const mutualMatch = await knex('playmates')
      .where(function () {
        this.where('dog_id', userId).andWhere('user_id', otherUserId).andWhere('matched', 1);
      })
      .orWhere(function () {
        this.where('dog_id', otherUserId).andWhere('user_id', userId).andWhere('matched', 1);
      })
      .count('* as count');

    if (mutualMatch[0].count === 2) {
      res.status(200).json({ matched: true });
    } else {
      res.status(200).json({ matched: false });
    }
  } catch (error) {
    console.error('Error checking mutual match:', error);
    res.status(500).send('Error checking mutual match');
  }
});


export default router;
  