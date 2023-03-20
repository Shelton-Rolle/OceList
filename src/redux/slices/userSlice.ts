import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface User {
    username: string;
    email: string;
    password: string;
}
// Define a type for the slice state
interface UserState {
    user: any;
}

// Define the initial state using that type
const initialState: UserState = {
    user: {
        username: '',
        email: '',
        password: '',
    },
};

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        update: (state, action: PayloadAction) => {
            state.user = action?.payload!;
        },
    },
});

export const { update } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
