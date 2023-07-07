import { createSlice } from '@reduxjs/toolkit';


// if userInfo is in localstorage if is present we use it or else we set it NULL-->it is stored as tring inlocal storage so we parse it into object

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            // action.payload is info we get from localStorage
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.userInfo = null; // redux state
            localStorage.removeItem('userInfo');
        }
    }
});
// exporting them as action so that we can use it
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer; // bring it to our store