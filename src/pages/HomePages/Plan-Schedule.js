import React from 'react';
import '../../styles/Home.css';

const PlanSchedule = ({ automatedSchedulingRef }) => {
    return (
        <section ref={automatedSchedulingRef} id="automated-scheduling">
            <div className="plan-schedule-container">
                <h2>Plan Your Schedule</h2>
                <p>Create a personalized schedule to manage your courses and study time effectively.</p>

                <div className="schedule-container">
                    {/* Time Slot Column */}
                    <div className="time-column">
                        <div className="time-slot">8:00 AM</div>
                        <div className="time-slot">9:00 AM</div>
                        <div className="time-slot">10:00 AM</div>
                        <div className="time-slot">11:00 AM</div>
                        <div className="time-slot">12:00 PM</div>
                        <div className="time-slot">1:00 PM</div>
                        <div className="time-slot">2:00 PM</div>
                        <div className="time-slot">3:00 PM</div>
                        <div className="time-slot">4:00 PM</div>
                    </div>

                    {/* Days of the Week Column */}
                    <div className="schedule-grid">
                        <div className="day-column">
                            <div className="day-header">Monday</div>
                            <div className="class-block" style={{ gridRow: '2 / span 2' }}>Math 101</div>
                            <div className="class-block" style={{ gridRow: '6 / span 2' }}>History 202</div>
                        </div>
                        <div className="day-column">
                            <div className="day-header">Tuesday</div>
                            <div className="class-block" style={{ gridRow: '3 / span 3' }}>Physics 303</div>
                        </div>
                        <div className="day-column">
                            <div className="day-header">Wednesday</div>
                            <div className="class-block" style={{ gridRow: '2 / span 2' }}>Math 101</div>
                            <div className="class-block" style={{ gridRow: '7 / span 2' }}>Chemistry 404</div>
                        </div>
                        <div className="day-column">
                            <div className="day-header">Thursday</div>
                            <div className="class-block" style={{ gridRow: '4 / span 2' }}>Biology 105</div>
                        </div>
                        <div className="day-column">
                            <div className="day-header">Friday</div>
                            <div className="class-block" style={{ gridRow: '2 / span 3' }}>Art 201</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlanSchedule;
