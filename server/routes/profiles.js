import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";

const knex = initKnex(configuration);
const router = express.Router();


// GET /profile/:userId - Retrieve user profile data including profile pictures
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user profile data from the database
    const userProfile = await knex('users')
      .join('dog_profiles', 'users.id', 'dog_profiles.owner_id')
      .select('users.email', 'users.name', 'dog_profiles.*')
      .where('users.id', userId)
      .first();

    if (!userProfile) {
      return res.status(404).send('User not found');
    }

    // Send the user profile data and image in the response
    res.status(200).json({
      email: userProfile.email,
      owner_name: userProfile.name,
      dog_name: userProfile.dog_name,
      dog_age: userProfile.dog_age,
      dog_breed: userProfile.dog_breed,
      play_styles: userProfile.play_styles,
      profile_pictures: userProfile.profile_pictures,
    });
  } catch (error) {
    console.error('Error fetching user profile: ', error);
    res.status(500).send('Error fetching user profile');
  }
});

// GET /matches - Retrieve potential matches for the user
router.get('/matches', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Query to get potential matches (dog profiles that the user hasn't interacted with)
    const potentialMatches = await knex('dog_profiles')
      .leftJoin('matches', function() {
        this.on('dog_profiles.owner_id', '=', 'matches.user2_id')
          .andOn('matches.user1_id', '=', userId);
      })
      .whereNull('matches.status')
      .andWhere('dog_profiles.owner_id', '!=', userId)
      .select(
        'dog_profiles.id',
        'dog_profiles.dog_name',
        'dog_profiles.dog_age',
        'dog_profiles.dog_breed',
        'dog_profiles.play_styles',
        'dog_profiles.profile_pictures'
      );

    res.status(200).json(potentialMatches);
  } catch (error) {
    console.error("Error fetching potential matches: ", error);
    res.status(500).send("Error fetching potential matches");
  }
});

// POST /like - Log a like interaction and handle mutual likes
router.post('/like', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { dogId } = req.body;

  if (!dogId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const likedDogProfile = await knex('dog_profiles').where({ id: dogId }).first();
    const likedUserId = likedDogProfile.owner_id;

    // Check if the liked user has already liked the current user's dog profile
    const mutualLike = await knex('matches')
      .where({
        user1_id: likedUserId,
        user2_id: userId,
        status: 'pending'
      })
      .first();

      if (mutualLike) {
        // Update both entries to matched
        await knex('matches')
          .where({ id: mutualLike.id })
          .update({ status: 'matched' });
      
        const [newMatchId] = await knex('matches').insert({
          user1_id: userId,
          user2_id: likedUserId,
          status: 'matched'
        }).returning('id');
      
        // Create a new chat entry linked to this match
        await knex('chats').insert({
          match_id: newMatchId,
          created_at: knex.fn.now(),
        });
      
        return res.status(200).send("It's a match!");
      }

    // Otherwise, log the like interaction as pending
    await knex('matches').insert({
      user1_id: userId,
      user2_id: likedUserId,
      status: 'pending'
    });

    res.status(200).send("Dog profile liked successfully");
  } catch (error) {
    console.error("Error liking dog profile: ", error);
    res.status(500).send("Error liking dog profile");
  }
});

// POST /pass - Log a pass interaction as rejected
router.post('/pass', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { dogId } = req.body;

  if (!dogId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const passedDogProfile = await knex('dog_profiles').where({ id: dogId }).first();
    if (!passedDogProfile) {
      return res.status(404).send("Dog profile not found");
    }
    const passedUserId = passedDogProfile.owner_id;

    // Log the pass interaction as rejected
    await knex('matches').insert({
      user1_id: userId,
      user2_id: passedUserId,
      status: 'rejected'
    });

    res.status(200).send("Dog profile passed successfully");
  } catch (error) {
    console.error("Error passing dog profile: ", error);
    res.status(500).send("Error passing dog profile");
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
