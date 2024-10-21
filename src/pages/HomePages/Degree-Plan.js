// Degree-Plan.js
import React from 'react';
import '../../styles/Home.css';

const DegreePlan = ({ degreeProgressRef }) => {
    return (
        <section ref={degreeProgressRef} id="degree-progress">
            <div className="degree-path-container">
                <h2>Plan Your Degree Path</h2>
                <p>Stay in control of your academic journey with a real-time view of your progress, keeping you on the fastest path to graduation.</p>

                <div className="degree-plan">
                    <div className="semester-row">
                        <div className="semester">
                            <h3>Semester 1 - Fall 2024</h3>
                            <ul className="class-list">
                                <li>Introduction to Computer Science (CS 101)</li>
                                <li>Calculus I (MATH 181)</li>
                                <li>English Composition (ENG 121)</li>
                                <li>History of Western Civilization (HIST 101)</li>
                                <li>History of Western Civilization (HIST 101)</li>
                            </ul>
                        </div>

                        <div className="semester">
                            <h3>Semester 2 - Spring 2025</h3>
                            <ul className="class-list">
                                <li>Data Structures (CS 201)</li>
                                <li>Calculus II (MATH 182)</li>
                                <li>Physics I (PHYS 211)</li>
                                <li>World Literature (ENG 202)</li>
                                <li>History of Western Civilization (HIST 101)</li>
                            </ul>
                        </div>

                        <div className="semester">
                            <h3>Semester 3 - Fall 2025</h3>
                            <ul className="class-list">
                                <li>Algorithms (CS 301)</li>
                                <li>Discrete Mathematics (MATH 210)</li>
                                <li>Physics II (PHYS 212)</li>
                                <li>Public Speaking (COMM 101)</li>
                                <li>History of Western Civilization (HIST 101)</li>
                            </ul>
                        </div>

                        <div className="semester">
                            <h3>Semester 4 - Spring 2026</h3>
                            <ul className="class-list">
                                <li>Algorithms (CS 301)</li>
                                <li>Discrete Mathematics (MATH 210)</li>
                                <li>Physics II (PHYS 212)</li>
                                <li>Public Speaking (COMM 101)</li>
                                <li>History of Western Civilization (HIST 101)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DegreePlan;
