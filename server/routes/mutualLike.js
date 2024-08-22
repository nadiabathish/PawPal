import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();

router.put('/', authenticateToken, async (req, res) => {
  console.log("Mutual Like route hit"); 

  const { likedDogId } = req.body;
  const userId = req.user.userId;

  console.log("likedDogId:", likedDogId); 
  console.log("userId:", userId); 

  try {
    await knex('playmates')
    .where('dog_id', likedDogId)
    .andWhere('user_id', userId)
    .update({ matched: 1, handled: 1 });

    await knex('playmates')
    .where('dog_id', userId)
    .andWhere('user_id', likedDogId)
    .update({ matched: 1, handled: 1 });

    return res.status(200).send("It's a match!");
  } catch (error) {
    console.error('Error handling mutual like:', error);
    return res.status(500).send('Error handling mutual like');
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
  