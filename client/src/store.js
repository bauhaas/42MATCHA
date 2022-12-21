import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        id: (state = null, action) => {
            switch (action.type) {
                case 'SET_ID':
                    return action.id;
                default:
                    return state;
            }
        },
    },
});

export default store;