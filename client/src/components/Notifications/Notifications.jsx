import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      }
    };

    fetchNotifications();
  }, []);

  
  const handleLike = async (likedDogId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE_URL}/mutuallike`, { likedDogId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data === "It's a match!") {
        alert('You have a new match! You can now chat with this user.');
      }
      setNotifications(notifications.filter((notif) => notif.id !== likedDogId));
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = async (dogId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/playmates/pass`, { dogId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh notifications after action
      setNotifications(notifications.filter((notif) => notif.id !== dogId));
    } catch (error) {
      console.error('Error passing profile:', error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div key={`${notif.id}-${index}`}>
            <p>{notif.dog_name} ({notif.dog_breed}) liked your dog profile.</p>
            <button onClick={() => handleLike(notif.id)}>Like</button>
            <button onClick={() => handlePass(notif.id)}>Pass</button>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
}

export default Notifications;
