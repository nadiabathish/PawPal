import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const userId = Number(localStorage.getItem('userId')); // Convert userId to a number
  const ws = useRef(null);
  const wsInitialized = useRef(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    if (wsInitialized.current) return;

    const connectWebSocket = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received:', message);

        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.current.onclose = () => {
        console.log('Websocket disconnected');
      };
    };

    setTimeout(connectWebSocket, 500);
    wsInitialized.current = true;

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/playmates/matches/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        console.log('Users:', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentRecipientId) return;
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/messages/${userId}/${currentRecipientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.chat_id) {
          setCurrentChatId(response.data.chat_id);
          setMessages(response.data.messages);
          console.log('Messages:', response.data.messages);
        } else {
          console.error('No chat ID returned');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [currentRecipientId, userId]);

  const handleSendMessage = async () => {
    if (!currentRecipientId) {
      console.error('Recipient ID is not set.');
      return;  // Return early if no recipient is selected
    }

    try {
      // Retrieve the JWT token from localStorage for authentication
      const token = localStorage.getItem('authToken');

      // Send a POST request to the API to send the new message to the selected recipient
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        recipientId: currentRecipientId,  // Send the recipient ID in the request
        message: newMessage,  // Send the new message content
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });
      // Send the new message through WebSocket to notify other users
      ws.current.send(JSON.stringify({
        id: response.data.id,
        sender_id: userId,
        recipient_id: currentRecipientId,
        message: newMessage,
        sent_at: new Date().toISOString(),
      }));

      // Clear the new message input field after sending the message
      setNewMessage('');
    } catch (error) {
      // Handle any errors, log them
      console.error('Error sending message:', error);
    }
  };

  // Helper function to get the sender's name based on the message data
  const getSenderName = (message) => {
    // If the sender is the current user, return 'You'
    if (message.sender_id === userId) {
      return 'You';
    } else {
      // Otherwise, find the sender in the users list and return their name
      const sender = users.find(user => user.user_id === message.sender_id);
      return sender ? sender.user_name : 'Other';  // Return the sender's name or 'Other' if not found
    }
  };

  return (
    <div className="chat">
      <h1>Chat with Other Dog Owners</h1>
      <div className="chat__container">
        <div className="chat__user-list">
          <h2>Select a user to chat with:</h2>
          {users.map((user, index) => (
            <button
              key={`user-${user.user_id}-${index}`} // Ensure unique key by combining user_id and index
              onClick={() => setCurrentRecipientId(user.user_id)}
              className={currentRecipientId === user.user_id ? 'active' : ''}
            >
              <img
                src={user.profile_picture_url || '/default-avatar.jpg'}
                alt={`${user.dog_name}'s profile`}
                className="chat__user-picture"
              />
              {user.dog_name} ({user.user_name})
            </button>
          ))}
        </div>
        <div className="chat__message--container">
          <div className="chat__messages">
            {currentRecipientId ? (
              messages.map((message, index) => (
                <div 
                  key={`message-${message.id}-${message.sent_at}-${index}`} // Ensure unique key by combining message id, timestamp, and index
                  className={`chat__message chat__message--${message.sender_id === userId ? "sent" : "received"}`}
                >
                  <p>
                    <strong>{getSenderName(message)}</strong>: {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p>Please select a user to view messages.</p>
            )}
          </div>
          <div className="chat__input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={currentRecipientId ? 'Type your message...' : 'Select a user to start typing...'}
              disabled={!currentRecipientId}
            />
            <button onClick={handleSendMessage} disabled={!currentRecipientId}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
