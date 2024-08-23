import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpForm.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function SignUpForm() {
    // State hooks to manage the form inputs for user information and dog profile data
    const [email, setEmail] = useState('');           // State to store the email input
    const [password, setPassword] = useState('');     // State to store the password input
    const [dogName, setDogName] = useState('');       // State to store the dog's name input
    const [ownersName, setOwnersName] = useState(''); // State to store the owner's name input
    const [dogAge, setDogAge] = useState('');         // State to store the dog's age input
    const [dogBreed, setDogBreed] = useState('');     // State to store the dog's breed input
    const [playStyles, setPlayStyles] = useState([]); // State to store selected play styles (as an array)
    const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // Event handler to update the playStyles array when a checkbox is checked/unchecked
    const handlePlayStyleChange = (e) => {
        const { value, checked } = e.target;
        // If checked, add the selected play style to the array; otherwise, remove it from the array
        setPlayStyles((prevPlayStyles) =>
            checked ? [...prevPlayStyles, value] : prevPlayStyles.filter((style) => style !== value)
        );
    };

    // Event handler for the form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        try {
            // Send a POST request to the signup API endpoint with user and dog profile data
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                email,
                password,
                name: ownersName, // Sending the user's name as 'name'
                dog_name: dogName,
                dog_age: dogAge,
                dog_breed: dogBreed,
                play_styles: playStyles, // Sending the array of selected play styles
            });

            // Extract the token from the response and save it in localStorage
            const { token } = response.data;
            localStorage.setItem('authToken', token);

            // Navigate to the profile page after successful signup
            navigate('/profile');
        } catch (error) {
            // Handle errors, log them, and display an error message to the user
            console.error("Error signing up:", error);
            setErrorMessage("Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="sign-up">
            <h1 className="sign-up__title">Create Your Profile</h1>
            <form onSubmit={handleSubmit} className="sign-up__form">
                <div className="sign-up__field">
                    <label htmlFor="email">Provide Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label htmlFor="password">Set Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />  
                </div>
                <div className="sign-up__field">
                    <label htmlFor="dogName">What’s Your Dog's Name?</label>
                    <input 
                        type="text" 
                        id="dogName" 
                        value={dogName} 
                        onChange={(e) => setDogName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label htmlFor="ownersName">Who’s the Lucky Hooman?</label>
                    <input 
                        type="text" 
                        id="ownersName" 
                        value={ownersName} 
                        onChange={(e) => setOwnersName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label htmlFor="dogAge">{dogName || "Dog"}'s Age (hooman math please)</label>
                    <input 
                        type="number" 
                        id="dogAge" 
                        value={dogAge} 
                        onChange={(e) => setDogAge(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label htmlFor="dogBreed">What’s the Fancy Breed?</label>
                    <input 
                        type="text" 
                        id="dogBreed" 
                        value={dogBreed} 
                        onChange={(e) => setDogBreed(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label>How Does {dogName || 'Your Fur Baby'} Like to Play?</label>
                    <div className="sign-up__checkbox-group">
                    
                        <label>
                             <input 
                                type="checkbox" 
                                value="Fetch" 
                                onChange={handlePlayStyleChange} 
                            />
                            Fetch
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Tug-of-War" 
                                onChange={handlePlayStyleChange} 
                            />
                            Tug-of-War
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Chase" 
                                onChange={handlePlayStyleChange} 
                            />
                            Chase
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Wrestling" 
                                onChange={handlePlayStyleChange} 
                            />
                            Wrestling
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Swimming" 
                                onChange={handlePlayStyleChange} 
                            />
                            Swimming
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Running" 
                                onChange={handlePlayStyleChange} 
                            />
                            Running
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="Quiet Play" 
                                onChange={handlePlayStyleChange} 
                            />
                            Quiet Play
                        </label>
                    
                    </div>
                </div>
                <button type="submit" className="sign-up__submit">Create My Pup's Profile</button>
                {errorMessage && <p className="sign-up__error">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default SignUpForm;
