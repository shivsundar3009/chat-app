import { configureStore } from '@reduxjs/toolkit';
import UserSlice from '../features/User/UserSlice';
import SocketSlice from '../features/Socket/SocketSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from "redux-persist/lib/storage";

const userPersistConfig = {
  key: 'User',
  storage,
  blacklist: ["selectedChatUser"], // Exclude specific fields from persistence
};

const socketPersistConfig = {
  key: 'Socket',
  storage,
};

const userPersistedReducer = persistReducer(userPersistConfig, UserSlice);
const socketPersistedReducer = persistReducer(socketPersistConfig, SocketSlice);

export const store = configureStore({
  reducer: {
    User: userPersistedReducer,
    Socket: socketPersistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['Socket.socket'], // Ignore specific paths in the Redux state
      },
    }),
});

export const persistor = persistStore(store);
