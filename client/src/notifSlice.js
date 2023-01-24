import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifs: [],
}

const notifSlice = createSlice({
    name: 'notifs',
    initialState,
    reducers: {
        setNotifs: (state, action) => {
            state.notifs = action.payload;
        },
        addNotif: (state, action) => {
            state.notifs.push(action.payload);
        },
        updateNotif: (state, action) => {
            const { id } = action.payload;
            const notifIndex = state.notifs.findIndex((notif) => notif.id === id);
            if (notifIndex >= 0) {
                state.notifs[notifIndex].read = true;
            }
        }
    },
});

export const { setNotifs, addNotif, updateNotif } = notifSlice.actions;
export default notifSlice.reducer;