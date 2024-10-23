import React, { useRef } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

import PlanSchedule from './HomePages/Plan-Schedule';
import DegreePlan from './HomePages/Degree-Plan';
import ExploreMajors from './HomePages/Explore-Majors';
import CourseRecommendations from './HomePages/Course-Recommendations';
import GraduationRoadmap from './HomePages/Graduation-Roadmap';
import TransferCreditEvaluation from './HomePages/Transfer-Credit-Evaluation';

function Home() {
    const navigate = useNavigate();

    // Create refs to scroll to each section
    const automatedSchedulingRef = useRef(null);
    const degreeProgressRef = useRef(null);
    const exploreMajorsRef = useRef(null);
    const courseRecommendationsRef = useRef(null);
    const graduationRoadmapRef = useRef(null);
    const transferCreditRef = useRef(null);

    // Scroll function
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };


    // Credit Transfers Data
    // Change to API later
    const transferCredits = [
        { course: 'Math 101', credits: 3, status: 'Accepted' },
        { course: 'History 202', credits: 3, status: 'Pending' },
        { course: 'Physics 303', credits: 4, status: 'Accepted' }
    ];
    const totalCredits = 120;


    return (
        <div className="home-container">
            <main className="main-content">
                <h1>Your advisor's favorite advisor.</h1>
                <h3>Streamline your academic journey with effortless scheduling, progress tracking, and personalized guidance--all in one place.</h3>

                {/* Buttons */}
                <div className="feature-buttons">
                    <button onClick={() => scrollToSection(automatedSchedulingRef)}>Automated Scheduling</button>
                    <button onClick={() => scrollToSection(degreeProgressRef)}>Degree Progress Tracker</button>
                    <button onClick={() => scrollToSection(exploreMajorsRef)}>Explore Majors</button>
                    <button onClick={() => scrollToSection(courseRecommendationsRef)}>Personalized Course Recommendations</button>
                    <button onClick={() => scrollToSection(graduationRoadmapRef)}>Graduation Roadmap</button>
                    <button onClick={() => scrollToSection(transferCreditRef)}>Transfer Credit Evaluation</button>
                </div>

                <div className="account-buttons">
                    <h2>Get Started Below:</h2>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/create-account')}>Create An Account</button>
                </div>
            </main>

            {/* Sections */}
            <section ref={automatedSchedulingRef} id="automated-scheduling">
                <div className="plan-schedule-container">
                    <PlanSchedule />
                </div>
            </section>

            <section ref={degreeProgressRef} id="degree-progress">
                <div className="degree-path-container">
                   <DegreePlan />
                </div>
            </section>

            <section ref={exploreMajorsRef} id="explore-majors">
                <div className="explore-majors-container">
                    <ExploreMajors />
                </div>
            </section>

            <section ref={courseRecommendationsRef} id="course-recommendations">
                <div className="course-recommendations-container">
                    <CourseRecommendations />
                </div>
            </section>

            <section ref={graduationRoadmapRef} id="graduation-roadmap">
                <div className="graduation-roadmap-container">
                    <GraduationRoadmap />
                </div>
            </section>

            <section ref={transferCreditRef} id="transfer-credit">
                <div className="transfer-credit-container">
                    <TransferCreditEvaluation transferCredits={transferCredits} totalCredits={totalCredits} />

                </div>
            </section>

            <section id="account-login">
                <div className="account-login-container">
                    <div className="account-container">
                        <h2>Ready to Get Started?</h2>
                        <div className="button-container">
                            <button className="main-button" onClick={() => navigate('/login')}>Login</button>
                            <button className="main-button">Create An Account</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

