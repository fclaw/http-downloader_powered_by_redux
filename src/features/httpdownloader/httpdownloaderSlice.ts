import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal';
import { RootState } from '../../app/store';

export enum HttpDownloaderState { Idle = 0, Loading };

const ABORT_REQUEST_CONTROLLERS = new Map();

function getSignal(key: string | undefined): AbortSignal {
    const newController = new AbortController();
    ABORT_REQUEST_CONTROLLERS.set(key, newController);
    return newController.signal;
}

function abortRequest(key: string | undefined): void {
    const controller = ABORT_REQUEST_CONTROLLERS.get(key);
    controller.abort();
}

function signalKeyGen(length: number): string {
    let result = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

interface HttpDowloader {
    url?: string,
    state: HttpDownloaderState,
    content?: string,
    signalKey?: string
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
    createAsyncThunk<string | undefined, void, { state: RootState }>(
        'httpdownloader/start',
        async (_, state) => {
            const url = selectUrl(state.getState());
            if (url !== undefined) {
                const signalKey = selectSignalKey(state.getState());
                // 'https://elm-lang.org/assets/public-opinion.txt'
                const sig = getSignal(signalKey)
                const res = await fetch(url, { signal: sig });
                if (res.body !== null) {
                    const buffer = await streamToArrayBuffer(res.body);
                    return new TextDecoder().decode(buffer);
                }
                else return undefined;
            }
            else return undefined;
        })

export const cancelPage =
    createAsyncThunk<string | undefined, void, { state: RootState }>(
        'httpdownloader/cancel',
        async (_, obj) => {
            const s = obj.getState();
            const signalKey = selectSignalKey(s)
            abortRequest(signalKey);
            return signalKey;
        })


const initialState: HttpDowloader =
{
    url: undefined,
    state: HttpDownloaderState.Idle,
    content: undefined,
    signalKey: undefined
}

export const httpdownloaderSlice =
    createSlice({
        name: 'httpdownloader',
        initialState,
        reducers: {
            fillUrl:
                (state, url) => {
                    state.url = url.payload;
                    const key = signalKeyGen(20);
                    state.signalKey = key;
                }
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

function downloadPagePendingBody(state: WritableDraft<HttpDowloader>): void {
    state.content = undefined;
    state.state = HttpDownloaderState.Loading
}

function downloadPageFulfilledBody(state: WritableDraft<HttpDowloader>, page: string | undefined) {
    state.state = HttpDownloaderState.Idle;
    state.content = page;
}

function downloadPageRejectedBody(state: WritableDraft<HttpDowloader>) {
    state.content = state.content !== undefined ? "cannot fetch the requested url:" + state.url : undefined;
    state.state = HttpDownloaderState.Idle;
}

function cancelBody(state: WritableDraft<HttpDowloader>) {
    state.content = undefined;
    state.state = HttpDownloaderState.Idle;
}

export default httpdownloaderSlice.reducer

export const { fillUrl } = httpdownloaderSlice.actions

export const selectUrl = (state: RootState) => state.httpdownloader.url
export const selectState = (state: RootState) => state.httpdownloader.state
export const selectContent = (state: RootState) => state.httpdownloader.content
export const selectSignalKey = (state: RootState) => state.httpdownloader.signalKey