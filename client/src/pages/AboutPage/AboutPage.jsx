import './AboutPage.scss';

function AboutPage() {
    return (
        <section className='about-page'>
            <div className='about'>
                <div className='about__intro'>
                    <h1 className='about__intro--title'>About Us</h1>
                    <p className='about__intro--text'>At <b>PawPal</b>, we believe that every dog deserves a fun and social life. We’re dog lovers, just like you, and we know how important it is for your furry friend to have a pack of pals to play with.</p>
                    <p className='about__intro--text'>We get it - sometimes finding the right playmate for your dog can be challenging, so we created a platform that makes it easy to connect with like-minded dog owners.</p>
                    <p className='about__intro--text'>Our team is passionate about pets, technology, and community building, and we’re excited to bring dog lovers together through PawPal.</p>
                </div>
                <div className='about__details'>
                    <div className='about__details--section'>
                        <h4 className='about__details--section-title'>Our Mission</h4>
                        <p className='about__details--section-text'>Our mission is simple: to make it easy for dog owners to connect with other dog lovers in their community. Whether your pup needs a running buddy, a playmate, or just some socialization, PawPal is here to help you find the perfect match.</p>
                    </div>
                    <div className='about__details--section'>
                        <h4 className='about__details--section-title'>How it Works</h4>
                        <p className='about__details--section-text'>PawPal is like a dating app for dogs, but instead of swiping for romance, you’re swiping for friendship! Create a profile for your dog, browse through potential playmates in your area, and arrange playdates with ease. We’ve made it simple and fun to connect with other dog owners who share your love for canines.</p>
                    </div>
                    <div className='about__details--section'>
                        <h4 className='about__details--section-title'>Get Started!</h4>
                        <p className='about__details--section-text'>Become a part of the PawPal community today! Whether you’re looking for a new friend for your dog or just want to be a part of a growing network of dog enthusiasts, PawPal is here for you. Let’s make the world a better place, one playdate at a time.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutPage