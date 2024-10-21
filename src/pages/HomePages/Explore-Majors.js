import React, { useState } from 'react';
import '../../styles/Home.css';

const ExploreMajors = () => {
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');

    const majors = [
        'Computer Science',
        'Biology',
        'Mathematics',
        'Psychology',
        'Business Administration',
    ];

    const colleges = [
        'College of Arts and Sciences',
        'College of Engineering',
        'Price College of Business',
        'College of Education',
        'College of Fine Arts',
    ];

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
    };

    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
    };

    return (
        <div className="explore-majors-container">
            <h2>Explore Majors</h2>
            <p>Select a major and explore the corresponding college.</p>

            <div className="dropdown-container">
                <div className="dropdown">
                    <label htmlFor="major-select">Find Your Major:</label>
                    <select id="major-select" value={selectedMajor} onChange={handleMajorChange}>
                        <option value="">--Select a Major--</option>
                        {majors.map((major, index) => (
                            <option key={index} value={major}>{major}</option>
                        ))}
                    </select>
                </div>

                <div className="dropdown">
                    <label htmlFor="college-select">Explore the Colleges:</label>
                    <select id="college-select" value={selectedCollege} onChange={handleCollegeChange}>
                        <option value="">--Select a College--</option>
                        {colleges.map((college, index) => (
                            <option key={index} value={college}>{college}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ExploreMajors;