import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import apiMiddleware from './middleware/apiMiddleware';
import socketMiddleware from './middleware/socketMiddleware';
import errorLoggerMiddleware from './middleware/errorLoggerMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['SOCKET_CONNECTED'],
        ignoredActionPaths: ['payload.socket'],
        ignoredPaths: ['socket'],
      },
    })
      .concat(apiMiddleware)
      .concat(socketMiddleware)
      .concat(errorLoggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
