import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import './Indexadmin.css';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

export const Indexadmin = () => {
  const now = new Date();
  const [jobData, setJobData] = useState([]);
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [searchUser, setSearchUser] = useState(''); 
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/getjobmonth?bulan=${bulan}&tahun=${tahun}`,
          { withCredentials: true }
        );
        setJobData(response.data.data);
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };
    fetchJobs();
  }, [bulan, tahun]);

  const handleSearchUserChange = (e) => {
    setSearchUser(e.target.value);
  };

  const filteredJobs = jobData.filter(job => 
    job.user && job.user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const userName = job.user ? job.user.name : 'Unknown';
    if (!acc[userName]) acc[userName] = [];
    acc[userName].push(job);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Admin
      </Typography>
      <Typography variant="subtitle1">
        Selamat datang kembali, <strong>{user && user.name}</strong>!
      </Typography>

      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Bulan"
            type="number"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            fullWidth
            inputProps={{ min: 1, max: 12 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Tahun"
            type="number"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            fullWidth
            inputProps={{ min: 2000, max: now.getFullYear() }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Cari Pengguna"
            type="text"
            value={searchUser}
            onChange={handleSearchUserChange}
            placeholder="Cari berdasarkan nama pengguna"
            fullWidth
          />
        </Grid>
      </Grid>

      {Object.keys(groupedJobs).length > 0 ? (
        Object.entries(groupedJobs).map(([userName, jobs]) => (
          <Box key={userName} sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Pekerjaan untuk: {userName}
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="job table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No</StyledTableCell>
                    <StyledTableCell>Nama Pekerjaan</StyledTableCell>
                    <StyledTableCell>Tanggal</StyledTableCell>
                    <StyledTableCell>Pengguna</StyledTableCell>
                    {/* <StyledTableCell>Tanggal Dibuat</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job, index) => (
                    <TableRow key={job.uuid}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{job.job}</TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell>{job.user ? job.user.name : 'Unknown'}</TableCell>
                      {/* <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Tidak ada data pekerjaan yang ditemukan
        </Typography>
      )}
    </Box>
  );
};
