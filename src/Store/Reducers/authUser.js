import {createSlice} from '@reduxjs/toolkit';

const authUser = createSlice({
  name: 'authUser',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    userData: (state, action) => (state = action.payload),
    isLoggedIn: (state, action) => void (state.isLoggedIn = action.payload),
  },
});

export const {userData, isLoggedIn} = authUser.actions;
export default authUser.reducer;
