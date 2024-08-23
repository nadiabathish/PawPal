import { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Chat() {
    // State hooks to manage users, messages, new message input, and the current recipient ID
    const [users, setUsers] = useState([]);                  // State to store the list of users (matches)
    const [messages, setMessages] = useState([]);             // State to store the chat messages
    const [newMessage, setNewMessage] = useState('');         // State to store the content of the new message being typed
    const [currentRecipientId, setCurrentRecipientId] = useState(null);  // State to store the ID of the current recipient user
    const userId = localStorage.getItem('userId');            // Retrieve the current user's ID from localStorage
  
    // useEffect to fetch matched users (playmates) when the component mounts
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          // Retrieve the JWT token from localStorage for authentication
          const token = localStorage.getItem('authToken');
  
          // Make a GET request to fetch the matched users for the current user
          const response = await axios.get(`${API_BASE_URL}/playmates/matches/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
            },
          });
  
          // Store the matched users in state
          setUsers(response.data);
        } catch (error) {
          // Handle any errors, log them
          console.error('Error fetching users:', error);
        }
      };
  
      // Call the fetchUsers function when the component mounts
      fetchUsers();
    }, [userId]);  // Dependency array ensures this effect runs when the userId changes
  
    // useEffect to fetch messages when the current recipient changes
    useEffect(() => {
      const fetchMessages = async () => {
        if (!currentRecipientId) return;  // If no recipient is selected, return early
        try {
          // Retrieve the JWT token from localStorage for authentication
          const token = localStorage.getItem('authToken');
  
          // Make a GET request to fetch messages between the current user and the selected recipient
          const response = await axios.get(`${API_BASE_URL}/messages/${userId}/${currentRecipientId}`, {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
            },
          });
  
          // Store the fetched messages in state
          setMessages(response.data);
        } catch (error) {
          // Handle any errors, log them
          console.error('Error fetching messages:', error);
        }
      };
  
      // Call the fetchMessages function when the current recipient changes
      fetchMessages();
    }, [currentRecipientId, userId]);  // Dependency array ensures this effect runs when currentRecipientId or userId changes
  
    // Event handler to send a new message
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
  
        // Update the messages state by appending the newly sent message to the list
        setMessages([...messages, {
          id: response.data.id,           // Use the ID from the response
          sender_id: userId,              // Set the sender ID to the current user
          recipient_id: currentRecipientId,  // Set the recipient ID to the selected recipient
          message: newMessage,            // Use the new message content
          sent_at: new Date().toISOString(),  // Set the sent timestamp to the current time
        }]);
  
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
  )
}

export default Chat
