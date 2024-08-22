import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSettings.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ProfileSettings() {
  const [profile, setProfile] = useState({
    dogName: "",
    ownersName: "",
    dogAge: "",
    dogBreed: "",
    playStyles: [],
  });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/profiles/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile({
          dogName: response.data.dog_name,
          ownersName: response.data.owner_name,
          dogAge: response.data.dog_age,
          dogBreed: response.data.dog_breed,
          playStyles: response.data.play_styles || [],
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, [userId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          playStyles: [...prevProfile.playStyles, value],
        }));
      } else {
        setProfile((prevProfile) => ({
          ...prevProfile,
          playStyles: prevProfile.playStyles.filter((style) => style !== value),
        }));
      }
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/profiles/profile/${userId}`, {
        dog_name: profile.dogName,
        owner_name: profile.ownersName,
        dog_age: profile.dogAge,
        dog_breed: profile.dogBreed,
        play_styles: profile.playStyles,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="profile-settings">
      <h1>Profile Settings</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="profile-settings__field">
          <label htmlFor="dogName">Dog Name</label>
          <input
            type="text"
            id="dogName"
            name="dogName"
            value={profile.dogName}
            onChange={handleChange}
          />
        </div>

        <div className="profile-settings__field">
          <label htmlFor="ownersName">Owner's Name</label>
          <input
            type="text"
            id="ownersName"
            name="ownersName"
            value={profile.ownersName}
            onChange={handleChange}
          />
        </div>

        <div className="profile-settings__field">
          <label htmlFor="dogAge">Dog Age</label>
          <input
            type="number"
            id="dogAge"
            name="dogAge"
            value={profile.dogAge}
            onChange={handleChange}
          />
        </div>

        <div className="profile-settings__field">
          <label htmlFor="dogBreed">Dog Breed</label>
          <input
            type="text"
            id="dogBreed"
            name="dogBreed"
            value={profile.dogBreed}
            onChange={handleChange}
          />
        </div>

        <div className="profile-settings__field">
          <label>Play Styles</label>
          <div className="profile-settings__checkbox-group">
            {['Fetch', 'Tug-of-War', 'Chase', 'Wrestling', 'Swimming', 'Running', 'Quiet Play'].map((style) => (
              <label key={style}>
                <input
                  type="checkbox"
                  name="playStyles"
                  value={style}
                  checked={profile.playStyles.includes(style)}
                  onChange={handleChange}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" onClick={handleSave}>Save Changes</button>
      </form>
    </div>
  )
}

export default ProfileSettings
