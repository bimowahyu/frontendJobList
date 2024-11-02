import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { LoginUser, reset } from "../fitur/AuthSlice";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(
      (state) => state.auth
    );

    useEffect(() => {
      if (user && isSuccess) {
        // Cek role user untuk menentukan rute yang sesuai
        if (user.role === 'admin') {
          navigate("/dashboardadmin");
        } else {
          navigate("/dashboard");
        }
      }
      dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
      e.preventDefault();
      dispatch(LoginUser({ username, password }));
    };

    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        bgcolor="#f0f2f5"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 400 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" align="center" mb={3} color="textSecondary">
              Login to your account
            </Typography>
            <form onSubmit={Auth}>
              {isError && <p className="has-text-centered">{message}</p>}
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Box>
    );
};

export default Login;
