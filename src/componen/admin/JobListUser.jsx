import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import './users.css';

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${baseUrl}`;
};

export const JobListUser = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchJobsForUser();
    }, [month, year]); // Fetch jobs whenever month or year changes

    const fetchJobsForUser = async () => {
        try {
            console.log(`Fetching jobs for month: ${month}, year: ${year}`); // Debugging line
            const response = await axios.get(`${getApiBaseUrl()}/job`, {
                params: { bulan: month, tahun: year },
                withCredentials: true
            });
            setJobs(response.data.data);
        } catch (error) {
            setError('Error fetching jobs');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Job List', 20, 10);

        const jobData = jobs.map((job, index) => [
            index + 1,
            job.job,
            new Date(job.date).toLocaleDateString(),
        ]);

        doc.autoTable({
            head: [['No', 'Kegiatan', 'Date']],
            body: jobData,
            startY: 20,
        });
        doc.save('JobList.pdf');
    };

    return (
        <div className="job-list-container">
            <h2>Your Job List</h2>
            {error && <p className="text-danger">{error}</p>}

            {/* Month and Year Selection */}
            <Form.Group className="mb-3">
                <Form.Label>Filter by Month and Year</Form.Label>
                <Form.Control
                    type="month"
                    value={`${year}-${String(month).padStart(2, '0')}`}
                    onChange={(e) => {
                        const [selectedYear, selectedMonth] = e.target.value.split('-');
                        setYear(parseInt(selectedYear));
                        setMonth(parseInt(selectedMonth));
                    }}
                />
            </Form.Group>

            {jobs.length > 0 ? (
                <div className="user-job-table">
                    <Button
                        variant="primary"
                        onClick={exportToPDF}
                    >
                        Export to PDF
                    </Button>
                    
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kegiatan</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job, index) => (
                                <tr key={job.uuid}>
                                    <td>{index + 1}</td>
                                    <td>{job.job}</td>
                                    <td>{new Date(job.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <p>No job data available for this month.</p>
            )}
        </div>
    );
};
