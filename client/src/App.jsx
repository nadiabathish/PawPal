import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';

import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/about'
          element={<AboutPage />}
        />
        <Route
          path='/authentication'
          element={<AuthenticationPage />}
        />
        <Route
          path='/profile/:userId'
          element={<ProfilePage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
