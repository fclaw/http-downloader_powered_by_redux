import { createSlice, createAsyncThunk, applyMiddleware, AsyncThunk, Slice, SliceCaseReducers } from '@reduxjs/toolkit'
import internal from 'stream';

enum HttpDownloaderState { Idle = 0, Loading };

const ABORT_REQUEST_CONTROLLERS = new Map();

function getSignal(key: string): AbortSignal {
    const newController = new AbortController();
    ABORT_REQUEST_CONTROLLERS.set(key, newController);
    return newController.signal;
}

function abortRequest(key: string): void {
    const controller = ABORT_REQUEST_CONTROLLERS.get(key);
    controller.abort();
}

function signalKeyGen(length: number): string {
    let result = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result.concat(characters.charAt(Math.floor(Math.random() * charactersLength)));
        counter += 1;
    }
    return result.toString();
}

interface HttpDowloader {
    url?: string,
    state: HttpDownloaderState,
    content?: Text,
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

export const downloadPage
    : AsyncThunk<string | null, void, AsyncThunkConfig> =
    createAsyncThunk(
        'httpdownloader/start',
        async (_, obj) => {
            const s = obj.getState();
            const url = selectUrl(s).payload;
            const signalKey = selectSignalKey(s)
            // 'https://elm-lang.org/assets/public-opinion.txt'
            const sig = getSignal(signalKey)
            const res = await fetch(url, { signal: sig });
            if (res.body !== null) {
                const buffer = await streamToArrayBuffer(res.body);
                return new TextDecoder().decode(buffer);
            }
            else return null;
        })

export const cancelPage
    : AsyncThunk<any, void, AsyncThunkConfig> =
    createAsyncThunk(
        'httpdownloader/cancel',
        async (_, obj) => {
            const s = obj.getState();
            const signalKey = selectSignalKey(s)
            abortRequest(signalKey);
            return signalKey;
        })


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

const initialState : HttpDowloader = {

    url: undefined,
    state: HttpDownloaderState.Idle,
    content: undefined,
    signalKey: undefined
}


function fillUrlBody(state: { url: any; signalKey: string; }, url: any)
{
    state.url = url;
    state.signalKey = signalKeyGen(20);
}
