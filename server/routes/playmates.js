import express from 'express';
import initKnex from 'knex';
import configuration from '../knexfile.js';
import authenticateToken from '../middleware/authenticateToken.js';

const knex = initKnex(configuration);
const router = express.Router();

router.get('/matches/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const matches = await knex('matches')
      .where(function () {
        this.where({ user1_id: userId })
          .orWhere({ user2_id: userId });
      })
      .andWhere({ status: 'matched' });

    const matchedUsers = await Promise.all(matches.map(async (match) => {
      const matchedUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
      
      // Fetch the profile and user info only if the matched user is not the current user
      if (matchedUserId !== parseInt(userId)) {
        const matchedUserProfile = await knex('dog_profiles').where({ owner_id: matchedUserId }).first();
        const matchedUser = await knex('users').where({ id: matchedUserId }).first();

        return {
          user_id: matchedUser.id,
          user_name: matchedUser.name,
          dog_name: matchedUserProfile.dog_name,
          dog_breed: matchedUserProfile.dog_breed,
          profile_picture_url: matchedUserProfile.profile_pictures ? matchedUserProfile.profile_pictures[0] : null,
        };
      }
      return null; // Return null if the user is the current user
    }));

    // Filter out any null values from the result
    const filteredUsers = matchedUsers.filter(user => user !== null);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error fetching matched users:', error);
    res.status(500).send('Error fetching matched users');
  }
});

export default router;
