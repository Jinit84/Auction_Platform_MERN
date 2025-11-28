import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
    otpSent: false,
    error: null,
    message: null,
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    logoutSuccess(state, action) {
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
    },
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state, action) {
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
      state.leaderboard = state.leaderboard;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    // OTP Actions
    requestOTPRequest(state) {
      state.loading = true;
      state.otpSent = false;
      state.error = null;
      state.message = null;
    },
    requestOTPSuccess(state, action) {
      state.loading = false;
      state.otpSent = true;
      state.message = action.payload.message;
      state.error = null;
    },
    requestOTPFailed(state, action) {
      state.loading = false;
      state.otpSent = false;
      state.error = action.payload || 'Failed to send OTP';
    },
    verifyOTPRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    verifyOTPSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.otpSent = false;
      state.message = action.payload.message;
    },
    verifyOTPFailed(state, action) {
      state.loading = false;
      state.error = action.payload || 'Failed to verify OTP';
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/logout",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get("http://localhost:5000/api/v1/user/me", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

// Request OTP for login
export const requestOTP = (credentials) => async (dispatch) => {
  dispatch(userSlice.actions.requestOTPRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login/request-otp",
      credentials,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.requestOTPSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to send OTP';
    dispatch(userSlice.actions.requestOTPFailed(errorMessage));
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Verify OTP for login
export const verifyOTP = (otpData) => async (dispatch) => {
  dispatch(userSlice.actions.verifyOTPRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login/verify-otp",
      otpData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.verifyOTPSuccess(response.data));
    toast.success('Login successful!');
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
    dispatch(userSlice.actions.verifyOTPFailed(errorMessage));
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/leaderboard",
      {
        withCredentials: true,
      }
    );
    dispatch(
      userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard)
    );
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export default userSlice.reducer;
