import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const HttpDownLoaderState = ["Idle", "InProgress"];

const initialState =
 {
    url: null,
    state: HttpDownLoaderState[0],
    content: null
 }

export const downloadPage =
 createAsyncThunk(
  'httpdownloader/start',
  async (url) => {
   // 'https://elm-lang.org/assets/public-opinion.txt'
   const res = await fetch(url.payload);
   const buffer = await streamToArrayBuffer(res.body);
   const text = new TextDecoder().decode(buffer);
   return text;
  })

async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
   let result = new Uint8Array(0);
   const reader = stream.getReader();
   while (true) { // eslint-disable-line no-constant-condition
       const { done, value } = await reader.read();
       if (done) {
           break;
       }

       const newResult = new Uint8Array(result.length + value.length);
       newResult.set(result);
       newResult.set(value, result.length);
       result = newResult;
   }
   return result;
}

const httpdownloaderSlice = createSlice({
    name: 'httpdownloader',
    initialState,
    reducers: {
      fillUrl: fillUrlBody,
      cancel: cancelBody
    },
    extraReducers: builder => {
      builder
        .addCase(downloadPage.pending, (state, action) => {
         state.content = null;
         state.state = HttpDownLoaderState[1];
        })
        .addCase(downloadPage.fulfilled, (state, action) => {
         state.state = HttpDownLoaderState[0];
         state.content = action.payload;
        })
        .addCase(downloadPage.rejected, (state, action) =>
         {
            state.content = state.url != null ? "cannot fetch the requested url:" + state.url.payload : null;
            state.state = HttpDownLoaderState[0];
         });
    }
  })

function fillUrlBody(state, url) { state.url = url }

function cancelBody(state) {
   state.content = null;
   state.state = HttpDownLoaderState[0];
}

export default httpdownloaderSlice.reducer

export const { cancel, fillUrl } = httpdownloaderSlice.actions

export const selectUrl = state => state.httpdownloader.url
export const selectState = state => state.httpdownloader.state
export const selectContent = state => state.httpdownloader.content
