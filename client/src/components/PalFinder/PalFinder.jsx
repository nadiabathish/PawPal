import { useState, useEffect } from 'react';
import axios from 'axios';
import './PalFinder.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PalFinder() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/playmates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profiles', error);
        setError('Error fetching profiles');
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleLike = async () => {
    if (!currentProfile) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/playmates/like`, { dogId: currentProfile.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      setError('Error liking profile');
    }
  };

  const handlePass = async () => {
    if (!currentProfile) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/playmates/pass`, { dogId: currentProfile.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      setError('Error passing profile');
    }
  };

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentProfile) {
    return <p>No more profiles</p>;
  }

  return (
    <div className="pal-finder">
      <h1>Find Your Pup's Next Playdate</h1>
      <div className="pal-finder__card">
        <img src={currentProfile.image} alt={currentProfile.name} />
        <h2>{currentProfile.name}</h2>
        <p>{currentProfile.age} years old - {currentProfile.breed}</p>
        <p>Play Style: {currentProfile.play_styles.join(', ')}</p>
        <div className="pal-finder__actions">
          <button onClick={handlePass}>Pass</button>
          <button onClick={handleLike}>Like</button>
        </div>
      </div>
    </div>
  )
}

export default PalFinder;
