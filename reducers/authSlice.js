import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    firstname: '',
    lastname: '',
    adresse: '',
    role:'',
    genre:'',
    telephone:'',
    cp:'',
    date_naissance:'',
    idSUN:'',
    allergies:[],
    preferences_alimentaires:[],
    storeId:'',
    preferenceCommande: false,
  },
  selectedStore: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
    },
    loginUser: (state, action) => {
      // state.user = action.payload;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    logoutUser: (state, action) => {
      
      state.user = {
        firstname: '',
        lastname: '',
        adresse: '',
        
      };
    },
    updateSelectedStore: (state, action) => {
      state.selectedStore = action.payload

    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    setPreferenceCommande: (state, action) => {
      state.preferenceCommande = action.payload;
    },
  },
});

export const { registerUser, loginUser, logoutUser, updateSelectedStore, updateUser, setPreferenceCommande } = authSlice.actions;

export default authSlice.reducer;
