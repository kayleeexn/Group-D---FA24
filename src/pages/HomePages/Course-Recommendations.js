import React, { useState } from 'react';
import '../../styles/Home.css';

// Sample recommendations data
//Change to API Later
const personalizedRecommendations = [
    { id: 10, name: 'Advanced Data Structures', reason: 'Based on your interest in algorithms', category: 'Computer Science' },
    { id: 11, name: 'Psychology of Learning', reason: 'Fits your minor in Psychology', category: 'Psychology' },
    { id: 12, name: 'Business Analytics', reason: 'Aligns with your Business track', category: 'Business' },
    { id: 13, name: 'Software Engineering', reason: 'Based on your project experience in coding', category: 'Computer Science' },
    { id: 14, name: 'Sociology of Education', reason: 'Fits your minor in Sociology', category: 'Sociology' },
    { id: 15, name: 'Machine Learning', reason: 'Based on your interest in AI', category: 'Computer Science' },
];

const CourseRecommendations = () => {
    const [expandedCourse, setExpandedCourse] = useState(null);

    const toggleExpandCourse = (courseId) => {
        setExpandedCourse(prev => (prev === courseId ? null : courseId));
    };

    // Organize courses by category
    const categories = ['Computer Science', 'Psychology', 'Business', 'Sociology'];
    const coursesByCategory = categories.reduce((acc, category) => {
        acc[category] = personalizedRecommendations.filter(course => course.category === category);
        return acc;
    }, {});

    return (
        <div className="course-recommendations">
            <h2>Personalized Course Suggestions</h2>
            <p>These courses are specifically chosen for you based on your academic journey and interests:</p>

            <div className="recommendations-grid">
                {categories.map(category => (
                    <div key={category} className="recommendations-column">
                        <h3>{category}</h3>
                        <ul>
                            {coursesByCategory[category].map(course => (
                                <li 
                                    key={course.id} 
                                    className={`course-item ${expandedCourse === course.id ? 'expanded' : ''}`}
                                    onClick={() => toggleExpandCourse(course.id)}
                                >
                                    <div className="course-header">
                                        <strong>{course.name}</strong>: {course.reason}
                                        <button className="favorite-btn">
                                            {expandedCourse === course.id ? '★' : '☆'}
                                        </button>
                                    </div>
                                    {expandedCourse === course.id && (
                                        <div className="course-details">
                                            {/* Add course details here */}
                                            This course covers advanced topics in {course.name}, perfect for students interested in {course.reason}.
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseRecommendations;

