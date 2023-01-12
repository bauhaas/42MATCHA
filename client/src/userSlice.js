import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // console.log('setuser in redux');
           state.user = action.payload;
        },
        updateFiles: (state, action) => {
            if (!state.user.files) {
                state.user.files = [action.payload];
            } else {
                if(state.user.files[0] === null)
                    state.user.files[0] = action.payload;
                else
                state.user.files.push(action.payload);
            }
        },
        setFiles: (state, action) => {
            if (!state.user.files) {
                state.user.files = action.payload;
            } else {
                state.user.files = action.payload;
            }
        },
        removeFile: (state, action) => {
            const fileIndex = state.user.files.findIndex(file => file.id === action.payload.id);
            if (fileIndex !== -1) {
                state.user.files.splice(fileIndex, 1);
            }
        }
    },
});

export const { setUser, updateFiles, removeFile, setFiles } = userSlice.actions;
export default userSlice.reducer;