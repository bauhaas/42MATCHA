import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import userReducer from './userSlice';
import conversationsReducer from './convSlice';
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
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);