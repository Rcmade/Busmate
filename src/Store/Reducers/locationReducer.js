import {createSlice} from '@reduxjs/toolkit';

const initialState = {wait: null, previous: null, assigned: false};

const assignContributor = createSlice({
  name: 'assignContributor',
  initialState: initialState,
  reducers: {
    contributorState: (state, action) => (state = action.payload),
  },
});

export const {contributorState} = assignContributor.actions;
export default assignContributor.reducer;
