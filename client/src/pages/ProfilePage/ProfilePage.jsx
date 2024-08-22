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
  const { userId: paramUserId } = useParams();
  const [activeSection, setActiveSection] = useState('palFinder');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = paramUserId || localStorage.getItem('userId');
    
    if (!userId) {
      console.error("No userId found in URL or localStorage");
      setError("User not authenticated");
      navigate('/authentication'); 
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/profiles/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);  
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
        setLoading(false); 
      }
    };

    fetchProfileData();
  }, [paramUserId, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profileData) {
    return <p>No profile data found</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1 className="profile-page__owner-name">Welcome back, {profileData.owner_name}!</h1>
        <div className="profile-page__dog-profile">
            <h2 className="profile-page__dog-name">{profileData.dog_name}</h2>
            <img
              src={profileData.profile_picture_url}
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
