import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpForm.scss';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dogName, setDogName] = useState('');
    const [ownersName, setOwnersName] = useState('');
    const [dogAge, setDogAge] = useState('');
    const [dogBreed, setDogBreed] = useState('');
    const [playStyles, setPlayStyles] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [promptAnswer, setPromptAnswer] = useState('');
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handlePlayStyleChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setPlayStyles([...playStyles, value]);
        } else {
            setPlayStyles(playStyles.filter((style) => style !== value));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            email,
            password,
            owner_name: ownersName,
            dog_name: dogName,
            dog_age: dogAge,
            dog_breed: dogBreed,
            play_styles: playStyles
        };
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
            alert('User registered successfully!');
            navigate('/authentication');
        } catch (error) {
            console.error('Error registering user', error);
            alert('Failed to register');
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
                {/* <div className="sign-up__field">
                    <label htmlFor="prompt">Pick a Fun Question:</label>
                    <select 
                        id="prompt" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        required
                    >
                        <option value="">Choose a fun prompt</option>
                        <option value="favorite_toy">What toy makes your doggo's tail wag the most?</option>
                        <option value="favorite_activity">What’s your pup’s favorite pastime (besides belly rubs)?</option>
                        <option value="funniest_moment">Tell us the funniest thing your dog has ever done!</option>
                    </select>
                </div>
                <div className="sign-up__field">
                    <label htmlFor="promptAnswer">Spill the Beans! (Answer the Prompt)</label>
                    <textarea 
                        id="promptAnswer" 
                        value={promptAnswer} 
                        onChange={(e) => setPromptAnswer(e.target.value)} 
                        required 
                    />
                </div>
                <div className="sign-up__field">
                    <label htmlFor="images">Upload Some Pawesome Pics (up to 4):</label>
                    <input 
                        type="file" 
                        id="images" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload} 
                        required
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="sign-up__image-previews">
                    {images.map((image, index) => (
                        <div
                            className="sign-up__image-preview"
                            key={index}
                            style={{ backgroundImage: `url(${image})` }}
                        >
                            <img src={image} alt={`Upload Preview ${index + 1}`} />
                        </div>
                    ))}


                    {images.length < 4 && Array.from({ length: 4 - images.length }).map((_, index) => (
                        <div
                            key={index}
                            className="sign-up__image-preview sign-up__image-preview--empty"
                            onClick={handlePlaceholderClick}
                        >
                            +
                        </div>
                    ))}
                </div> */}
                <button type="submit" className="sign-up__submit">Create My Pup's Profile</button>
            </form>
        </div>
    );
}

export default SignUpForm;
