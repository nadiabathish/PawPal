import './Header.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import fullLogo from '../../assets/logos/pawpal-logo-full.svg';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
          axios.get(`${API_BASE_URL}/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => setIsLoggedIn(true))
          .catch(() => {
            localStorage.removeItem('authToken');
            setIsLoggedIn(false);
          });
        }
    
        const path = location.pathname;
        if (path === '/') {
          setActive("home");
        } else if (path === '/about') {
          setActive("about");
        } else if (path === '/authentication') {
          setActive("authentication");
        } else if (path.startsWith('/profile')) {
          setActive("profile");
        }
    }, [location.pathname]);

    const handleNavigation = (path, state) => {
        setActive(state);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setActive("home");
        navigate("/");
    };

    const getHeaderBackground = () => {
        switch (active) {
            case "home":
                return "#f6d46b"; // pawpal-yellow
            case "about":
                return "#d4c2ef"; // pawpal-light-purple
            case "authentication":
                return "#f5f7ee"; // pawpal-light-green
            case "profile":
                return "#f6d46b"; // pawpal-yellow
            default:
                return "#f6d46b"; // pawpal-yellow
        }
    };

    return (
        <header className='header' style={{ backgroundColor: getHeaderBackground() }}>
            <div className='header__logo'>
                <Link to='/'>
                    <img className='header__logo--image' src={fullLogo} alt="PawPal Logo" />
                </Link>
            </div>
            <div className='header__nav'>
                {isLoggedIn ? (
                    <>
                        <button 
                            onClick={() => handleNavigation("/profile", "profile")} 
                            className={active === "profile" ? "header__nav--active" : ""}
                        >
                            Profile
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="header__nav--logout"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => handleNavigation("/", "home")} 
                            className={active === "home" ? "header__nav--active" : ""}
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => handleNavigation("/about", "about")} 
                            className={active === "about" ? "header__nav--active" : ""}
                        >
                            About Us
                        </button>
                        <button 
                            onClick={() => handleNavigation("/authentication", "authentication")} 
                            className={active === "authentication" ? "header__nav--active" : ""}
                        >
                            Sign Up/Login
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header