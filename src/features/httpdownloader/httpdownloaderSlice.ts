import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal';
import { RootState } from '../../app/store';

export enum HttpDownloaderState { Idle = 0, Loading };

const ABORT_REQUEST_CONTROLLERS = new Map();

function getSignal(key: string | null): AbortSignal {
    const newController = new AbortController();
    ABORT_REQUEST_CONTROLLERS.set(key, newController);
    return newController.signal;
}

function abortRequest(key: string | null): void {
    const controller = ABORT_REQUEST_CONTROLLERS.get(key);
    controller.abort();
}

function signalKeyGen(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" as string;
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

interface HttpDownloader {
    url: string | null,
    state: HttpDownloaderState,
    content: string | null,
    signalKey: string | null
}


async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>)
    : Promise<Uint8Array> {
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

export const downloadPage =
    createAsyncThunk<string | null, void, { state: RootState }>(
        'httpdownloader/start',
        async (_, state) => {
            const url = selectUrl(state.getState());
            if (url !== null) {
                const signalKey = selectSignalKey(state.getState());
                // 'https://elm-lang.org/assets/public-opinion.txt'
                const sig = getSignal(signalKey)
                const res = await fetch(url, { signal: sig });
                if (res.body !== null) {
                    const buffer = await streamToArrayBuffer(res.body);
                    return new TextDecoder().decode(buffer);
                }
                else return null;
            }
            else return null;
        })

export const cancelPage =
    createAsyncThunk<string | null, void, { state: RootState }>(
        'httpdownloader/cancel',
        async (_, obj) => {
            const s = obj.getState();
            const signalKey = selectSignalKey(s)
            abortRequest(signalKey);
            return signalKey;
        })


const initialState: HttpDownloader =
{
    url: null,
    state: HttpDownloaderState.Idle,
    content: null,
    signalKey: null
}

export const httpdownloaderSlice =
    createSlice({
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

function downloadPagePendingBody(state: WritableDraft<HttpDownloader>): void {
    state.content = null;
    state.state = HttpDownloaderState.Loading
}

function downloadPageFulfilledBody(state: WritableDraft<HttpDownloader>, page: string | null) {
    state.state = HttpDownloaderState.Idle;
    state.content = page;
}

function downloadPageRejectedBody(state: WritableDraft<HttpDownloader>) {
    state.content = state.content !== null? "cannot fetch the requested url:" + state.url : null;
    state.state = HttpDownloaderState.Idle;
}

function cancelBody(state: WritableDraft<HttpDownloader>) {
    state.content = null;
    state.state = HttpDownloaderState.Idle;
}

function fillUrlBody(state: WritableDraft<HttpDownloader>, url: { payload: string; }) {
    state.url = url.payload;
    const key = signalKeyGen(20);
    state.signalKey = key;
}

export default httpdownloaderSlice.reducer

export const { fillUrl } = httpdownloaderSlice.actions

export const selectUrl = (state: RootState) => state.httpdownloader.url
export const selectState = (state: RootState) => state.httpdownloader.state
export const selectContent = (state: RootState) => state.httpdownloader.content
export const selectSignalKey = (state: RootState) => state.httpdownloader.signalKey