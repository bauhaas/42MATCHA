import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from './userSlice';
import conversationsReducer from './convSlice';
import notifsReducer from './notifSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)
const persistedConvs = persistReducer(persistConfig, conversationsReducer)
// const persistedNotifs = persistReducer(persistConfig, notifsReducer)

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        convs:persistedConvs,
        // notifs:persistedNotifs,
    }
});

export const persistor = persistStore(store);