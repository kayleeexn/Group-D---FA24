import React, { useEffect, useState } from 'react';

const DegreePlan = () => {
    const [majors, setMajors] = useState([]);
    const [selectedMajorId, setSelectedMajorId] = useState('');
    const [degreePlan, setDegreePlan] = useState([]);

    // Fetch the majors from the server when the component mounts
    useEffect(() => {
        const fetchMajors = async () => {
            const response = await fetch('/majors'); // Replace with your API endpoint for majors
            const data = await response.json();
            setMajors(data.data); // Assuming the data structure has a 'data' field
        };
        fetchMajors();
    }, []);

    // Fetch degree plan for the selected major
    const getDegreePlan = async () => {
        if (!selectedMajorId) return; // Prevent fetching if no major is selected
        const response = await fetch(`/degree-plan/${selectedMajorId}`); // Your API endpoint for degree plans
        const data = await response.json();
        setDegreePlan(data.data); // Set the fetched degree plan
    };

    return (
        <div>
            <h1>Select a Major</h1>
            <select
                value={selectedMajorId}
                onChange={(e) => setSelectedMajorId(e.target.value)}
            >
                <option value="">-- Select a Major --</option>
                {majors.map((major) => (
                    <option key={major.id} value={major.id}>
                        {major.majorName}
                    </option>
                ))}
            </select>
            <button onClick={getDegreePlan}>Get Degree Plan</button>

            <h2>Degree Plan</h2>
            <ul>
                {degreePlan.length === 0 ? (
                    <li>No courses found for this major.</li>
                ) : (
                    degreePlan.map((course) => (
                        <li key={course.courseID}>
                            {course.courseID} - {course.courseName} ({course.courseCreditHours})
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default DegreePlan;
