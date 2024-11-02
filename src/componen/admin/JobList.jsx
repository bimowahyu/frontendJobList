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

export const JobList = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState({});
    const [error, setError] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            fetchJobsForAllUsers();
        }
    }, [month, year, users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${getApiBaseUrl()}/users`, { withCredentials: true });
            setUsers(response.data.data);
        } catch (error) {
            setError('Error fetching users');
        }
    };

    const fetchJobsForAllUsers = async () => {
        try {
            const response = await axios.get(`${getApiBaseUrl()}/getjobmonth`, {
                params: { bulan: month, tahun: year },
                withCredentials: true,
            });
            // Group jobs by userUuid
            const jobData = response.data.data.reduce((acc, job) => {
                const userId = job.userUuid;
                if (!acc[userId]) acc[userId] = [];
                acc[userId].push(job);
                return acc;
            }, {});
            setJobs(jobData);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const exportToPDF = (userId, username) => {
        const doc = new jsPDF();
        doc.text(`Job List for ${username}`, 20, 10);

        const jobData = jobs[userId]?.map((job, index) => [
            index + 1,
            job.job,
            new Date(job.date).toLocaleDateString(),
        ]);

        doc.autoTable({
            head: [['No', 'Kegiatan', 'Date']],
            body: jobData,
            startY: 20,
        });
        doc.save(`JobList_${username}.pdf`);
    };

    return (
        <div className="job-list-container">
            <h2>User Job List</h2>
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

            {users.map((user) => (
                <div key={user.uuid} className="user-job-table mb-5">
                    <h4>{user.name}'s Jobs</h4>
                    <Button
                        variant="primary"
                        onClick={() => exportToPDF(user.uuid, user.username)}
                        disabled={!jobs[user.uuid] || jobs[user.uuid].length === 0}
                    >
                        Export to PDF
                    </Button>
                    
                    {jobs[user.uuid] && jobs[user.uuid].length > 0 ? (
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kegiatan</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs[user.uuid].map((job, index) => (
                                    // <tr key={job.uuid}>
                                    <tr key={job.uuid || index}>
                                        <td>{index + 1}</td>
                                        <td>{job.job}</td>
                                        <td>{new Date(job.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No job data available for this month.</p>
                    )}
                </div>
            ))}
        </div>
    );
};
