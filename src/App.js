import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact'


import NoPage from './pages/NoPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import './styles/App.css';
import './styles/global.css';



function App() {

  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={ <Home /> } />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={ <Dashboard />} />
            <Route path="*" element={<NoPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;