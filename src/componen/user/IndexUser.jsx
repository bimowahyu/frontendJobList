import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Indexuser.css'

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${baseUrl}`;
  };
  
  // Fungsi untuk mendapatkan tanggal hari ini
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };
export const IndexUser = () => {
    const [jobData, setJobData] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
  
    const handleJobChange = (e) => {
      setJobData(e.target.value);
    };
  
    const handleDateChange = (e) => {
      setDate(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const response = await axios.post(`${getApiBaseUrl()}/createjob`, {
          job: jobData,
          date: date,
        });
        console.log(response);
        alert('Data pekerjaan berhasil ditambahkan!');
        setJobData('');
        setDate('');
      } catch (error) {
        console.error(error);
        alert('Gagal menambahkan data pekerjaan');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="admin-dashboard">
        <h1 className="title"></h1>
        <h2 className="subtitle">
          Selamat datang kembali, <strong>{user && user.name}</strong>!
        </h2>
  
        {/* Form untuk menambah data pekerjaan */}
        <div className="form-card">
          <h3>Tambahkan Data Pekerjaan</h3>
          <form onSubmit={handleSubmit} className="create-job-form">
            <label htmlFor="job">Nama Pekerjaan</label>
            <input
              type="text"
              id="job"
              name="job"
              value={jobData}
              onChange={handleJobChange}
              placeholder="Masukkan nama pekerjaan"
              required
            />
            <label htmlFor="date">Tanggal Tugas</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={handleDateChange}
              max={getCurrentDate()} // Batas maksimum tanggal adalah hari ini
              required
            />
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      </div>
    );
  };
  