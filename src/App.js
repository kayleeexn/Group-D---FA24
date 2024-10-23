import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import DegreePlan from './components/DegreePlan';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact'


import NoPage from './pages/NoPage';
import Login from './pages/Login';
import CreateAccount from './pages/Create-Account';
import Dashboard from './pages/Dashboard';
import CreateAccount from './pages/CreateAccount'; 


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
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={ <Dashboard />} />
            <Route path="/degree-plan" element={<DegreePlan />} />
            <Route path="*" element={<NoPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
