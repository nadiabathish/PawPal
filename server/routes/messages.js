import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// GET /:userId/:recipientId - Fetch the chat history between two users
router.get('/:userId/:recipientId', authenticateToken, async (req, res) => {
  const { userId, recipientId } = req.params;

  try {
    // First, get the match ID
    const match = await knex('matches')
      .where({ user1_id: userId, user2_id: recipientId, status: 'matched' })
      .orWhere({ user1_id: recipientId, user2_id: userId, status: 'matched' })
      .select('id')
      .first();

    if (!match) {
      return res.status(400).send("No match exists between users.");
    }

    // Then use the match ID to get the chat
    const chat = await knex('chats').where({ match_id: match.id }).first();

    if (!chat) {
      return res.status(400).send("No chat exists between users.");
    }

    // Finally, fetch the messages using the chat ID
    const messages = await knex('messages')
      .where({ chat_id: chat.id })
      .orderBy('sent_at', 'asc');

    res.status(200).json({ chat_id: chat.id, messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).send('Error fetching chat history');
  }
});

// POST / - Send a new message between two users
router.post('/', authenticateToken, async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.userId;

  if (!recipientId || !message) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Get the match
    const match = await knex('matches')
      .where({ user1_id: senderId, user2_id: recipientId, status: 'matched' })
      .orWhere({ user1_id: recipientId, user2_id: senderId, status: 'matched' })
      .select('id')
      .first();

    if (!match) {
      return res.status(400).send("No match exists between users.");
    }

    // Check if a chat already exists for this match, otherwise create it
    let chat = await knex('chats').where({ match_id: match.id }).first();

    if (!chat) {
      const [newChatId] = await knex('chats').insert({
        match_id: match.id,
        created_at: knex.fn.now(),
      }).returning('id');

      chat = { id: newChatId };
    }

    // Insert the new message
    const [messageId] = await knex('messages').insert({
      chat_id: chat.id,
      sender_id: senderId,
      recipient_id: recipientId,
      message,
      sent_at: knex.fn.now(),
    });

    res.status(201).json({ id: messageId });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

export default router;
