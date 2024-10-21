import React, { useState } from 'react';
import '../../styles/Home.css';

const GraduationRoadmap = () => {
    const [selectedCourses, setSelectedCourses] = useState({});
    const terms = Array.from({ length: 16 }, (_, i) => ({
        name: `Term ${i + 1}`,
        courses: [
            { name: `Course ${i * 3 + 1}`, credits: 3 },
            { name: `Course ${i * 3 + 2}`, credits: 3 },
            { name: `Course ${i * 3 + 3}`, credits: 3 },
        ],
    }));

    const totalCreditsRequired = 120;
    const completedCredits = Object.values(selectedCourses).reduce((acc, isSelected) => {
        return isSelected ? acc + 3 : acc; // Assuming each course is 3 credits
    }, 0);

    const progressPercentage = (completedCredits / totalCreditsRequired) * 100;

    const toggleCourse = (termIndex, courseIndex) => {
        const courseKey = `${termIndex}-${courseIndex}`;
        setSelectedCourses(prev => ({
            ...prev,
            [courseKey]: !prev[courseKey],
        }));
    };

    return (
        <div className="graduation-roadmap-container">
            <h2>Graduation Roadmap</h2>
            <p>Unlock new opportunities and discover the perfect major for your passions, career goals, and personal strength. 
                Navigate your academic journey with a step-by-step roadmap designed to get you to graduation on time and with confidence.</p>
            <p>Total Credits Taken: {completedCredits} / {totalCreditsRequired}</p>
            
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
            </div>

            <div className="terms-container">
                {terms.map((term, termIndex) => (
                    <div key={termIndex} className="term-box">
                        <h3>{term.name}</h3>
                        <ul>
                            {term.courses.map((course, courseIndex) => (
                                <li key={courseIndex}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCourses[`${termIndex}-${courseIndex}`] || false}
                                        onChange={() => toggleCourse(termIndex, courseIndex)}
                                    />
                                    {course.name} - {course.credits} credits
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraduationRoadmap;
