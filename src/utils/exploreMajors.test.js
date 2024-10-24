import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExploreMajors from './ExploreMajors'; // Adjust the import path as necessary

// Mock the fetch call
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ majors: ['Computer Science', 'Mathematics', 'Biology'] }),
    })
);

describe('ExploreMajors Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders and fetches majors', async () => {
        render(<ExploreMajors />);

        // Wait for the majors to be fetched and rendered
        await waitFor(() => {
            expect(screen.getByText(/Select a major below/i)).toBeInTheDocument();
        });

        // Verify the presence of the major options
        expect(screen.getByText('Computer Science')).toBeInTheDocument();
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
        expect(screen.getByText('Biology')).toBeInTheDocument();
    });

    test('selecting a major updates the state', async () => {
        render(<ExploreMajors />);

        await waitFor(() => {
            expect(screen.getByText('Computer Science')).toBeInTheDocument();
        });

        // Simulate selecting a major
        fireEvent.change(screen.getByLabelText(/Find Your Major/i), { target: { value: 'Computer Science' } });

        // Verify that the value has been updated (you can adjust this based on your implementation)
        expect(screen.getByLabelText(/Find Your Major/i).value).toBe('Computer Science');
    });
});
