import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
const knex = initKnex(configuration);
const router = express.Router();

router.get('/:userId/:recipientId', authenticateToken, async (req, res) => {
  const { userId, recipientId } = req.params;

  try {
    const messages = await knex('messages')
      .where(function () {
        this.where('sender_id', userId).andWhere('recipient_id', recipientId);
      })
      .orWhere(function () {
        this.where('sender_id', recipientId).andWhere('recipient_id', userId);
      })
      .orderBy('sent_at', 'asc');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Error fetching messages');
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.userId; 
  
  console.log('recipientId:', recipientId);

  try {
    await knex('messages').insert({
      sender_id: senderId,
      recipient_id: recipientId,
      message,
      sent_at: knex.fn.now(),
    });

    res.status(201).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});


// GET /messages/:userId: - Get a list of messages for a user
router.get("/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await knex("messages")
    .where({ recipient_id: userId })
    .orWhere({ sender_id: userId })
    .select("*");
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res.status(500).send("Error fetching messages");
  }
});


export default router;
