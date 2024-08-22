import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import './AuthenticationPage.scss';


function AuthenticationPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialForm = queryParams.get('form') === 'login' ? 'login' : 'signup';
    
    const [isSignUp, setIsSignUp] = useState(initialForm === 'signup');

    useEffect(() => {
        setIsSignUp(initialForm === 'signup');
    }, [initialForm]);

   return (
       <section className='auth-page'>
           <div className='auth'>
               <div className='auth__buttons'>
                   <button
                       onClick={() => setIsSignUp(true)}
                       className={isSignUp ? 'auth__button--active' : ''}>
                       Sign Up
                   </button>
                   <button
                       onClick={() => setIsSignUp(false)}
                       className={!isSignUp ? 'auth__button--active' : ''}>
                       Login
                   </button>
               </div>
               <div className='auth__forms'>
                   {isSignUp ? <SignUpForm /> : <LoginForm />}
               </div>
           </div>
       </section>
   )
}

export default AuthenticationPage;

