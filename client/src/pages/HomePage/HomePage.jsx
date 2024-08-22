import './HomePage.scss';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/home-hero.svg';
import fullLogo from '../../assets/logos/pawpal-logo-full.svg';

function HomePage() {
    return (
        <section className='home-page'>
            <div className='hero'>
                <div className='hero__image'>
                    <img className='hero__image--image' src={heroImage} alt="hero image" />
                </div>
                <div className='hero__copy'>
                    <div>
                        <img className='hero__copy--image' src={fullLogo} alt="PawPal Logo" />
                        <h1 className='hero__copy--title'>Furry Friend Finder.</h1>
                        <p className='hero__copy--text'>The <b>ultimate</b> platform for dog owners to find the perfect playmate! <b>Create</b> a profile for your dog, <b>explore</b> local playmates, and <b>schedule</b> fun-filled playdates with just a swipe. </p>
                    </div>
                    <div className='hero__actions'>
                        <h2 className='hero__actions--title'>Let the adventure begin!</h2>
                        <div className='hero__actions--buttons'>
                            <Link to='/authentication?form=signup'>
                                <button className='hero__actions--button'>Sign Up</button>
                            </Link>
                            <Link to='/authentication?form=login'>
                                <button className='hero__actions--button'>Login</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section> 
    )
}

export default HomePage