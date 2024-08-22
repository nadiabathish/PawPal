import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();

// GET /notifications: - Fetch notifications for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const notifications = await knex('playmates')
    .join('dog_profiles', 'playmates.dog_id', '=', 'dog_profiles.id')
    .where('dog_profiles.owner_id', userId)
    .andWhere('playmates.status', 'liked')
    .andWhere('playmates.matched', 0)
    .select('dog_profiles.id', 'dog_profiles.dog_name', 'dog_profiles.dog_breed', 'playmates.dog_id');

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
});


router.post('/', authenticateToken, async (req, res) => {
  console.log("Mutual Like route hit");

  const { likedDogId } = req.body;
  const userId = req.user.userId;

  console.log("likedDogId:", likedDogId);  
  console.log("userId:", userId);
  
  try {
    const match = await knex('playmates')
      .where('dog_id', likedDogId)
      .andWhere('user_id', userId)
      .andWhere('status', 'liked')
      .first();

    if (match) {
      await knex('playmates')
      .where('dog_id', likedDogId)
      .andWhere('user_id', userId)
      .update({ matched: 1 });

      await knex('playmates')
      .where('dog_id', userId)
      .andWhere('user_id', likedDogId)
      .update({ matched: 1 });

      res.status(200).send('It\'s a match!');
    } else {
      res.status(404).send('No match found');
    }
  } catch (error) {
    console.error('Error handling mutual like:', error);
    res.status(500).send('Error handling mutual like');
  }
});
  

export default router;