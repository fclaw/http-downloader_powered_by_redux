import { createSlice } from '@reduxjs/toolkit'

export const HttpDownLoaderState = ["Idle", "InProgress"];

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
    reducers: {
      fillUrl: (state, url) => { state.url = url },
      start: state => { state },
      cancel: state => { state }
    }
  })

export default httpdownloaderSlice.reducer

export const { start, cancel, fillUrl } = httpdownloaderSlice.actions

export const selectUrl = state => state.httpdownloader.url
export const selectState = state => state.httpdownloader.state
export const selectContent = state => state.httpdownloader.content
export const selectId = state => state.httpdownloader.id