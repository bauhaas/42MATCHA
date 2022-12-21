import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        user: (state = null, action) => {
            switch (action.type) {
                case 'SET_USER':
                    return action.user;
                default:
                    return state;
            }
        },
    },
});

export default store;