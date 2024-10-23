import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import '../../styles/Home.css';

const ExploreMajors = () => {
    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');

    useEffect(() => {
        // Fetch the JSON file
        fetch('/json/majors.json')
            .then(response => response.json())
            .then(data => setMajors(data.majors))
            .catch(error => console.error('Error fetching majors:', error));
    }, []);

    return (
        <div className="explore-majors-container">
            <h2>Explore Majors</h2>
            <p>Select a major below.</p>

            <Autocomplete
                disablePortal
                options={majors} // Use the majors array as options
                getOptionLabel={(option) => option} // Define how to display the option
                onChange={(event, value) => setSelectedMajor(value)} // Update selected major
                renderInput={(params) => <TextField {...params} label="Find Your Major" />}
                sx={{ width: 1200 }} // Set the width of the combobox
            />
        </div>
    );
};

export default ExploreMajors;
