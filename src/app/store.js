import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../model/Counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})