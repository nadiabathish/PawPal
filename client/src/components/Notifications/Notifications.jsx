import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Notifications() {
  // State hooks to manage the notifications and any error messages encountered
  const [notifications, setNotifications] = useState([]);  // State to store the list of notifications fetched from the API
  const [error, setError] = useState(null);  // State to store any error messages

  // useEffect to fetch notifications from the API when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Retrieve the JWT token from localStorage for authentication
        const token = localStorage.getItem('authToken');

        // Make a GET request to the notifications API endpoint to fetch notifications for the user
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
          },
        });

        // Store the notifications in state
        setNotifications(response.data);
      } catch (error) {
        // Handle any errors, log them, and set the error state
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      }
    };

    // Call the fetchNotifications function when the component mounts
    fetchNotifications();
  }, []);  // Empty dependency array ensures this effect only runs once when the component mounts

  // Handle the "like" action when the user likes a profile from a notification
  const handleLike = async (matchId, dogId) => {
    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('authToken');

      // Send a POST request to the like API endpoint, passing the dog ID
      const response = await axios.post(`${API_BASE_URL}/profiles/like`, { dogId }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });

      // If the like results in a match, alert the user
      if (response.data === "It's a match!") {
        alert('You have a new match! You can now chat with this user.');
      }

      // Remove the notification from the list by filtering it out
      setNotifications(notifications.filter((notif) => notif.match_id !== matchId));
    } catch (error) {
      // Handle errors, log them
      console.error('Error liking profile:', error);
    }
  };

  // Handle the "pass" action when the user passes on a profile from a notification
  const handlePass = async (matchId, dogId) => {
    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('authToken');

      // Send a POST request to the pass API endpoint, passing the dog ID
      await axios.post(`${API_BASE_URL}/profiles/pass`, { dogId }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });

      // Remove the notification from the list by filtering it out
      setNotifications(notifications.filter((notif) => notif.match_id !== matchId));
    } catch (error) {
      // Handle errors, log them
      console.error('Error passing profile:', error);
    }
  };

  // If there is an error, display the error message
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="notifications">
      <h2 className="notifications__title">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div key={`${notif.match_id}-${index}`} className="notification">
            <img 
              src={notif.profile_pictures ? notif.profile_pictures[0] : '/placeholder.jpg'} 
              alt={`${notif.dog_name}'s profile`} 
              className="notification__image"
            />
            <p className="notification__text">
              {notif.dog_name} ({notif.dog_breed}) liked your dog profile.
            </p>
            <div className="notification__actions">
              <button 
                className="notification__button notification__button--like" 
                onClick={() => handleLike(notif.match_id, notif.dog_id)}
              >
                Like
              </button>
              <button 
                className="notification__button notification__button--pass" 
                onClick={() => handlePass(notif.match_id, notif.dog_id)}
              >
                Pass
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="notifications__empty">No new notifications</p>
      )}
  </div>

  )
}

export default Notifications
