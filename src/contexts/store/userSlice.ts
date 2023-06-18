import { createSlice } from '@reduxjs/toolkit';

export type UserProps = { id: string };

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserProps | null,
  reducers: {
    setUser: (state, action) => (state = action.payload),
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
