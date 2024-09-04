import { useState, useEffect } from 'react';
import axios from 'axios';
import './PalFinder.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PalFinder() {
  // State hooks to manage the dog profiles, the current profile being viewed, loading state, and error messages
  const [profiles, setProfiles] = useState([]);            // State to store the list of profiles fetched from the API
  const [currentIndex, setCurrentIndex] = useState(0);      // State to track the index of the current profile being displayed
  const [loading, setLoading] = useState(true);             // State to track whether the profiles are still being loaded
  const [error, setError] = useState('');                   // State to store any error messages encountered during data fetching or actions

  // Get the current profile based on the currentIndex
  const currentProfile = profiles[currentIndex];

  // useEffect to fetch profiles from the API when the component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Retrieve the JWT token from localStorage for authentication
        const token = localStorage.getItem('authToken');

        // Make a GET request to the matches API endpoint to fetch potential matches
        const response = await axios.get(`${API_BASE_URL}/profiles/matches`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
          },
        });

        // Store the profiles in state and mark loading as complete
        setProfiles(response.data);
        setLoading(false);
      } catch (error) {
        // Handle any errors, log them, and set the error state
        console.error('Error fetching profiles', error);
        setError('Error fetching profiles');
        setLoading(false);
      }
    };

    // Call the fetchProfiles function when the component mounts
    fetchProfiles();
  }, []);  // Empty dependency array ensures this effect only runs once when the component mounts

  // Handle the "like" action when the user likes the current profile
  const handleLike = async () => {
    if (!currentProfile) return;  // Return early if there is no current profile to like

    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('authToken');

      // Send a POST request to the like API endpoint, passing the dog ID of the current profile
      await axios.post(`${API_BASE_URL}/profiles/like`, { dogId: currentProfile.id }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });

      // Move to the next profile by incrementing the currentIndex
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      // Handle errors, log them, and set the error message
      setError('Error liking profile');
    }
  };

  // Handle the "pass" action when the user passes on the current profile
  const handlePass = async () => {
    if (!currentProfile) return;  // Return early if there is no current profile to pass on

    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('authToken');

      // Send a POST request to the pass API endpoint, passing the dog ID of the current profile
      await axios.post(`${API_BASE_URL}/profiles/pass`, { dogId: currentProfile.id }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });

      // Move to the next profile by incrementing the currentIndex
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      // Handle errors, log them, and set the error message
      setError('Error passing profile');
    }
  };

  // Render the loading state if the profiles are still being fetched
  if (loading) {
    return <p>Loading profiles...</p>;
  }

  // Render the error message if there was an error during fetching or actions
  if (error) {
    return <p>{error}</p>;
  }

  // If there are no more profiles to show, display a message indicating that
  if (!currentProfile) {
    return <p>No more profiles</p>;
  }

  // Extract relevant data from the current profile for display
  const profilePicture = currentProfile.profile_pictures?.[0] || '';  // Get the first image from the profile_pictures array, or fallback to an empty string
  const dogName = currentProfile.dog_name;    // Get the dog's name from the profile
  const dogAge = currentProfile.dog_age;      // Get the dog's age from the profile
  const dogBreed = currentProfile.dog_breed;  // Get the dog's breed from the profile

  return (
    <div className="pal-finder">
      <h1 className="pal-finder__title">Find Your Pup's Next Playdate</h1>
      <div className="pal-finder__card">
        <img 
          className="pal-finder__card-image" 
          src={profilePicture} 
          alt={currentProfile.name} 
        />
        <h2 className="pal-finder__card-name">{dogName}</h2>
        <p className="pal-finder__card-age"><b>Age:</b> {dogAge} years old</p>
        <p className="pal-finder__card-breed"><b>Breed:</b> {dogBreed}</p>
        <p className="pal-finder__card-playstyle"><b>Play Style:</b> {currentProfile.play_styles.join(', ')}</p>
        <div className="pal-finder__actions">
          <button className="pal-finder__actions-btn pal-finder__actions-btn--pass" onClick={handlePass}>Pass</button>
          <button className="pal-finder__actions-btn pal-finder__actions-btn--like" onClick={handleLike}>Like</button>
        </div>
      </div>
    </div>
  )
}

export default PalFinder;
