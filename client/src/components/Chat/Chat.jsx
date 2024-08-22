import { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const userId = localStorage.getItem('userId');

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
      } catch (error) {
        console.error('Error fetching users', error);
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
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };
    fetchMessages();
  }, [userId, currentRecipientId]);

  const handleSendMessage = async () => {
    if (!currentRecipientId) {
      console.error('Recipient ID is not set.');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        recipientId: currentRecipientId,
        message: newMessage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([...messages, { 
        id: response.data.id, 
        sender_id: userId, 
        recipient_id: currentRecipientId, 
        message: newMessage, 
        sent_at: new Date().toISOString() 
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const getSenderName = (message) => {
    if (message.sender_id === userId) {
      return 'You';
    } else {
      const sender = users.find(user => user.user_id === message.sender_id);
      return sender ? sender.user_name : 'Other';
    }
  };

  return (
    <div className="chat">
      <h1>Chat with Other Dog Owners</h1>
      <div className="chat__container">
        <div className="chat__user-list">
          <h2>Select a user to chat with:</h2>
          {users.map((user) => (
            <button
              key={user.user_id}
              onClick={() => setCurrentRecipientId(user.user_id)}
              className={currentRecipientId === user.user_id ? 'active' : ''}
            >
              <img
                src={user.profile_picture_url}
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
              messages.map((message) => (
                <div key={`${message.id}-${message.sent_at}`} className={`chat__message chat__message--${message.sender_id === userId ? "sent" : "received"}`}>
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
            placeholder={currentRecipientId ? "Type your message..." : "Select a user to start typing..."}
            disabled={!currentRecipientId} 
          />
          <button onClick={handleSendMessage} disabled={!currentRecipientId}>Send</button>
        </div>
      </div>
      </div>      
    </div>
  )
}

export default Chat;
