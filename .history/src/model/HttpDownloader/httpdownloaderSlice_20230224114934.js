import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const HttpDownLoaderState = ["Idle", "InProgress"];

const ABORT_REQUEST_CONTROLLERS = new Map();

function getSignal(key) {
   const newController = new AbortController();
   ABORT_REQUEST_CONTROLLERS.set(key, newController);
   return newController.signal;
 }

function abortRequest(key) {
   const controller = ABORT_REQUEST_CONTROLLERS.get(key);
   controller.abort();
}

function signalKeyGen(length) {
   let result = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   let counter = 0;
   while (counter < length) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
     counter += 1;
   }
   return result;
}

const initialState =
 {
    url: null,
    state: HttpDownLoaderState[0],
    content: null,
    signalKey: null
 }

export const downloadPage =
 createAsyncThunk(
  'httpdownloader/start',
  async (_, obj) => {
   const s = obj.getState();
   const url = selectUrl(s).payload;
   const signalKey = selectSignalKey(s)
   // 'https://elm-lang.org/assets/public-opinion.txt'
   const sig = getSignal(signalKey)
   const res = await fetch(url, { signal: sig });
   const buffer = await streamToArrayBuffer(res.body);
   const text = new TextDecoder().decode(buffer);
   return text;
  })

async function streamToArrayBuffer(stream) {
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

export const cancelPage =
 createAsyncThunk(
   'httpdownloader/cancel',
   async (_, obj) => {
      const s = obj.getState();
      const signalKey = selectSignalKey(s)
      abortRequest(signalKey);
      return  signalKey;
   })

const httpdownloaderSlice = createSlice({
    name: 'httpdownloader',
    initialState,
    reducers: {
      fillUrl: fillUrlBody
    },
    extraReducers: builder => {
      builder
        .addCase(downloadPage.pending, (state, _) => { downloadPagePendingBody(state); })
        .addCase(downloadPage.fulfilled, (state, action) => { downloadPageFulfilledBody(state, action.payload); })
        .addCase(downloadPage.rejected, (state, _) => { downloadPageRejectedBody(state); })
        .addCase(cancelPage.pending, (state, _) => { return state; })
        .addCase(cancelPage.fulfilled, (state, _) => { cancelBody(state); })
        .addCase(cancelPage.rejected, (state, _) => { return state; });
    }
  })

function fillUrlBody(state, url)
  {
    state.url = url;
    state.signalKey = signalKeyGen(20);
  }

function downloadPagePendingBody(state) {
   state.content = null;
   state.state = HttpDownLoaderState[1]
}

function downloadPageFulfilledBody(state, page) {
   state.state = HttpDownLoaderState[0];
   state.content = page;
}

function downloadPageRejectedBody(state) {
   state.content = state.url != null ? "cannot fetch the requested url:" + state.url.payload : null;
   state.state = HttpDownLoaderState[0];
}

function cancelBody(state) {
   state.content = null;
   state.state = HttpDownLoaderState[0];
}

export default httpdownloaderSlice.reducer

export const { fillUrl } = httpdownloaderSlice.actions

export const selectUrl = state => state.httpdownloader.url
export const selectState = state => state.httpdownloader.state
export const selectContent = state => state.httpdownloader.content
export const selectSignalKey = state => state.httpdownloader.signalKey
