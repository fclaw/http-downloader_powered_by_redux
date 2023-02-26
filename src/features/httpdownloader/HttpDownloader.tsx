import React from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectState
    , selectContent
    , HttpDownloaderState
    , fillUrl
    , downloadPage
    , cancelPage
} from './httpdownloaderSlice'

export function HttpDownloader() {
    const dispatch = useAppDispatch();
    const ct = useAppSelector(selectContent);
    const st = useAppSelector(selectState);
    return (
        <div>
            <input type="text" onInput={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(fillUrl(event.target.value))} />
            <div className="btn-group" role="group" aria-label="...">
                <button type="button" className="btn btn-default" disabled={st === HttpDownloaderState.Loading} onClick={() => dispatch(downloadPage())} >start</button>
                <button type="button" className="btn btn-default" disabled={st === HttpDownloaderState.Idle} onClick={() => dispatch(cancelPage())}>stop</button>
            </div>
            <p>{st === HttpDownloaderState.Loading ? "download is in process ..." : ct}</p>
        </div>
    );
}