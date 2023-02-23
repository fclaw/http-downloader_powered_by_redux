import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import
  {   selectUrl
    , selectState
    , selectContent
    , selectSignalKey
    , HttpDownLoaderState
    , fillUrl
    , cancel
    , downloadPage
    , cancelPage
  } from './httpdownloaderSlice'

export function HttpDownloader() {
  const dispatch = useDispatch()
  const ct = useSelector(selectContent)
  const st = useSelector(selectState)
  const url = useSelector(selectUrl)
  const sig = useSelector(selectSignalKey)
  return (
    <div>
        <input type="text" onInput={evt => dispatch(fillUrl(evt.target.value))} />
      <div class="btn-group" role="group" aria-label="...">
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[1]} onClick={() => dispatch(downloadPage({urlf: url, sigf: sig}))} >start</button>
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[0]} onClick={() => dispatch(cancelPage(sig))}>stop</button>
      </div>
      <p>{st == HttpDownLoaderState[1] ? "download is in process ..." : ct}</p>
    </div>
  )
}