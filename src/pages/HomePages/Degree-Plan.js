import React, { useState, useEffect } from 'react';
import '../../styles/Home.css';

const DegreePlan = ({ degreeProgressRef, selectedCourses }) => {
    // State to manage the degree plan courses
    const [degreePlan, setDegreePlan] = useState([]);

    // Effect to update the degree plan based on selected courses
    useEffect(() => {
        if (selectedCourses && selectedCourses.length > 0) {
            setDegreePlan(selectedCourses);
        }
    }, [selectedCourses]);

    // Function to group courses by semester
    const groupCoursesBySemester = (courses) => {
        const semesters = [
            { title: "Semester 1 - Fall 2024", courses: [] },
            { title: "Semester 2 - Spring 2025", courses: [] },
            { title: "Semester 3 - Fall 2025", courses: [] },
            { title: "Semester 4 - Spring 2026", courses: [] },
        ];

        courses.forEach((course, index) => {
            const semesterIndex = Math.floor(index / 5); // 5 courses per semester
            if (semesterIndex < semesters.length) {
                semesters[semesterIndex].courses.push(course);
            }
        });

        return semesters;
    };

    // Group the degree plan courses by semester
    const semesters = groupCoursesBySemester(degreePlan);

    return (
        <section ref={degreeProgressRef} id="degree-progress">
            <div className="degree-path-container">
                <h2>Plan Your Degree Path</h2>
                <p>Stay in control of your academic journey with a real-time view of your progress, keeping you on the fastest path to graduation.</p>

                <div className="degree-plan">
                    <div className="semester-row">
                        {semesters.map((semester, index) => (
                            <div className="semester" key={index}>
                                <h3>{semester.title}</h3>
                                <ul className="class-list">
                                    {semester.courses.length > 0 ? (
                                        semester.courses.map((course, courseIndex) => (
                                            <li key={courseIndex}>{course}</li>
                                        ))
                                    ) : (
                                        <li>No courses planned for this semester.</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DegreePlan;
