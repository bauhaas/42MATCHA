import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

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

// const persistor = persistStore(store);

// export { persistor };
export default store;