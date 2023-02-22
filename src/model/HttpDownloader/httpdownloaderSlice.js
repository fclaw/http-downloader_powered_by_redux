import { createSlice } from '@reduxjs/toolkit'
import './HttpDownLoaderS.css';

const HttpDownLoaderState = ["Idle", "InProgress"];

const initialState =
 {
    url: null,
    state: HttpDownLoaderState[0],
    content: null,
    id: null
 }


const httpdownloaderSlice = createSlice({
    name: 'httpdownloader',
    initialState,
    reducers: {}
  })

export default httpdownloaderSlice.reducer

export const selectUrl = state => state.httpdownloader.url
export const selectState = state => state.httpdownloader.state
export const selectContent = state => state.httpdownloader.content
export const selectId = state => state.httpdownloader.id