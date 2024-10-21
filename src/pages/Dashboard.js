import React, { useRef } from 'react';
import { useState } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

import PlanSchedule from './HomePages/Plan-Schedule';

function Dashboard () {
    return (
        <PlanSchedule />
    )
}

export default Dashboard;