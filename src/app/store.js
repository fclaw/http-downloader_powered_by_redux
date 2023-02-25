import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
// import counterReducer from '../model/Counter/counterSlice'
import httpdownloaderReducer from '../model/HttpDownloader/httpdownloaderSlice'
import logger from 'redux-logger'


const reducer = {httpdownloader: httpdownloaderReducer};

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});

export default store;