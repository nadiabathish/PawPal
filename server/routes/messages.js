import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

// GET /:userId/:recipientId - Fetch the chat history between two users
router.get('/:userId/:recipientId', authenticateToken, async (req, res) => {
  // Extract userId and recipientId from the request parameters
  const { userId, recipientId } = req.params;

  try {
    // Query the 'messages' table to fetch the chat history between two users, 
    // where either the current user is the sender and the recipient is the receiver or vice versa.
    const messages = await knex('messages')
      .where(function () {
        this.where({ sender_id: userId, recipient_id: recipientId }) // Check if the current user is the sender and the recipient is the receiver
          .orWhere({ sender_id: recipientId, recipient_id: userId }); // Or check if the recipient is the sender and the current user is the receiver
      })
      .orderBy('sent_at', 'asc'); // Order the messages by the time they were sent in ascending order (oldest first)

    // Respond with the chat history
    res.status(200).json(messages);
  } catch (error) {
    // Log any errors and respond with a 500 status if the query fails
    console.error('Error fetching chat history:', error);
    res.status(500).send('Error fetching chat history');
  }
});

// POST / - Send a new message between two users
router.post('/', authenticateToken, async (req, res) => {
  // Extract the recipientId and message from the request body, and the senderId from the authentication token
  const { recipientId, message } = req.body;
  const senderId = req.user.userId;

  // Return a 400 status if the recipientId or message is missing from the request
  if (!recipientId || !message) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Query the 'chats' table to verify if a matched chat exists between the sender and recipient
    const [chat] = await knex('chats').where({
      match_id: await knex('matches')
        .where({ user1_id: senderId, user2_id: recipientId, status: 'matched' }) // Check if a match exists where sender is user1 and recipient is user2
        .orWhere({ user1_id: recipientId, user2_id: senderId, status: 'matched' }) // Or check if the match exists where sender is user2 and recipient is user1
        .select('id')
    });

    // If no chat exists between the users, respond with a 400 status
    if (!chat) {
      return res.status(400).send("No chat exists between users.");
    }

    // Insert the new message into the 'messages' table with the chat_id, sender_id, recipient_id, message content, and the current timestamp
    const [messageId] = await knex('messages').insert({
      chat_id: chat.id,
      sender_id: senderId,
      recipient_id: recipientId,
      message,
      sent_at: knex.fn.now()
    });

    // Respond with the newly created message ID
    res.status(201).json({ id: messageId });
  } catch (error) {
    // Log any errors and respond with a 500 status if the message sending fails
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});


export default router;
