import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

// POST /dog_profiles: Create a new dog profile with up to 4 pictures
router.post("/", authenticateToken, async (req, res) => {
  const { dog_name, dog_age, dog_breed, play_styles, profile_pictures } = req.body;

  try {
    const [profileId] = await knex("dog_profiles").insert({
      dog_name,
      dog_age,
      dog_breed,
      play_styles,
      owner_id: req.user.userId,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }).returning("id");

    if (profile_pictures && profile_pictures.length > 0) {
      const pictures = profile_pictures.slice(0, 4).map((url) => ({
        url,
        dog_profile_id: profileId,
        created_at: knex.fn.now(),
      }));

      await knex("dog_profile_pictures").insert(pictures);
    }

    res.status(201).send("Dog profile created successfully with pictures");
  } catch (error) {
    console.error("Error creating dog profile: ", error);
    res.status(500).send("Error creating dog profile");
  }
});

// GET /dog_profiles/:id: Fetch a dog profile with pictures
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const profile = await knex("dog_profiles")
      .where("dog_profiles.id", req.params.id)
      .first();
    if (!profile) {
      return res.status(404).send("Dog profile not found");
    }

    const pictures = await knex("dog_profile_pictures")
      .where("dog_profile_id", req.params.id)
      .select("url");
    profile.pictures = pictures.map(picture => picture.url);

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching dog profile: ", error);
    res.status(500).send("Error fetching dog profile");
  }
});

export default router;
