import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
   const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${baseUrl}`;
  };
  

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

const api = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true
});

export const LoginUser = createAsyncThunk("user/loginUser", async(user, thunkAPI) => {
    try {
        const response = await api.post('/login', {
            username: user.username,
            password: user.password
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});
//validasi agar masuk ke dashboard harus login


export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        const response = await api.get('/me');
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/logOut", async() => {
    await api.delete('/logout');
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) =>{
        builder.addCase(LoginUser.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // Get User Login
        builder.addCase(getMe.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;