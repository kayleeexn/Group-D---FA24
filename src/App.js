import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import DegreePlan from './components/DegreePlan';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NoPage from './pages/NoPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateAccount from './pages/CreateAccount'; 

import './styles/App.css';
import './styles/global.css';

function App() {
  const degreeProgressRef = useRef(null); // Create a ref for degree plan

  // Example selected courses, update this with user selections
  const selectedCourses = [
    "Introduction to Computer Science (CS 101)",
    "Calculus I (MATH 181)",
    "Data Structures (CS 201)",
    "Algorithms (CS 301)",
    // Add other courses based on user selection
  ];

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
          
          {/* Pass props to DegreePlan */}
          <Route 
            path="/degree-plan" 
            element={<DegreePlan degreeProgressRef={degreeProgressRef} selectedCourses={selectedCourses} />} 
          />
          
          <Route path="*" element={<NoPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
