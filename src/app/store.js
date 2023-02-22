import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../model/Counter/counterSlice'
import httpdownloaderReducer from '../model/HttpDownloader/httpdownloaderSlice'

export default configureStore({
  reducer: {
    //  counter: counterReducer
    httpdownloader: httpdownloaderReducer
  }
})