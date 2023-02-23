import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
// import counterReducer from '../model/Counter/counterSlice'
import httpdownloaderReducer from '../model/HttpDownloader/httpdownloaderSlice'

export default configureStore({
  reducer: {
    //  counter: counterReducer
    httpdownloader: httpdownloaderReducer,
   // middleware: getDefaultMiddleware
  }
})