import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    id: null,
    name: null,
    firstName: null,
    email: null,
  },
  token: null,
  loaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return {
        ...state,
        token: action.payload.token,
        userData: {
          id: action.payload.id,
          name: action.payload.name,
          firstName: action.payload.firstName,
          email: action.payload.email,
        },
      };
    },

    setAuthLoaded: (state, _action) => {
      return {
        ...state,
        loaded: true,
      };
    },

    logout: (state) => {
      return {
        ...state,
        token: null,
        userData: {
          id: null,
          name: null,
          firstName: null,
          email: null,
        },
      };
    },
  },
});

export default authSlice;
