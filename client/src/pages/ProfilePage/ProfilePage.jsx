import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.scss';
import PalFinder from '../../components/PalFinder/PalFinder';
import Chat from '../../components/Chat/Chat';
import ProfileSettings from '../../components/ProfileSettings/ProfileSettings';
import Notifications from '../../components/Notifications/Notifications';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ProfilePage() {
  const [activeSection, setActiveSection] = useState('palFinder');  // State to manage the active section of the profile page  
  const [profileData, setProfileData] = useState(null);  // State to store the user's profile data once it's fetched
  const [loading, setLoading] = useState(true);  // State to track the loading state while the profile data is being fetched 
  const [error, setError] = useState(null);  // State to store any error messages encountered during data fetching
  const navigate = useNavigate();  // Hook to programmatically navigate to other routes

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage (previously saved during authentication)
    
    // If no userId is found, set an error, redirect to authentication, and stop execution
    if (!userId) {
      console.error("No userId found in localStorage");
      setError("User not authenticated");
      navigate('/authentication'); 
      return;
    }
  
    // Function to fetch the user's profile data from the API
    const fetchProfileData = async () => {
      try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('authToken');

        // Make an authenticated GET request to the profile API endpoint
        const response = await axios.get(`${API_BASE_URL}/profiles/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
          },
        });

        // Set the fetched profile data into state and mark loading as complete
        setProfileData(response.data);
        setLoading(false);  
      } catch (err) {
        // If an error occurs during the API call, log it and set the error state
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
        setLoading(false); 
      }
    };

    fetchProfileData(); // Trigger the profile data fetching function on component mount
  }, [navigate]); // Dependency array ensures this effect runs on initial render or when 'navigate' changes
 
  // If the data is still loading, display a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there was an error, display the error message
  if (error) {
    return <p>{error}</p>;
  }

  // If no profile data was fetched, display a fallback message
  if (!profileData) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1 className="profile-page__owner-name">Welcome back, {profileData.owner_name}!</h1>
        <div className="profile-page__dog-profile">
            <h2 className="profile-page__dog-name">{profileData.dog_name}</h2>
            <img
              src={profileData.profile_pictures}
              alt={`${profileData.dog_name}'s profile`}
              className="profile-page__dog-picture"
            />
            <div className="profile-page__dog-description">
              <p className="profile-page__dog-detail"><b>Breed:</b> {profileData.dog_breed}</p>
              <p className="profile-page__dog-detail"><b>Age:</b> {profileData.dog_age} years old</p>
              <p className="profile-page__dog-detail"><b>Play Styles:</b> {profileData.play_styles.join(', ')}</p>
            </div>
        </div>
      </div>

      <div className="profile-page__nav">
        <button
          onClick={() => setActiveSection('palFinder')}
          className={`profile-page__nav-item ${activeSection === 'palFinder' ? 'profile-page__nav-item--active' : ''}`}
        >
          Pal Finder
        </button>
        <button
          onClick={() => setActiveSection('chat')}
          className={`profile-page__nav-item ${activeSection === 'chat' ? 'profile-page__nav-item--active' : ''}`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`profile-page__nav-item ${activeSection === 'notifications' ? 'profile-page__nav-item--active' : ''}`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveSection('profileSettings')}
          className={`profile-page__nav-item ${activeSection === 'profileSettings' ? 'profile-page__nav-item--active' : ''}`}
        >
          Profile Settings
        </button>
      </div>

      <div className="profile-page__content">
        {activeSection === 'palFinder' && <PalFinder />}
        {activeSection === 'chat' && <Chat />}
        {activeSection === 'notifications' && <Notifications />}
        {activeSection === 'profileSettings' && <ProfileSettings profileData={profileData} />}
      </div>
    </div>
  )
}

export default ProfilePage;
