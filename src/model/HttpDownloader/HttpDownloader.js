import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import
  {   selectUrl
    , selectState
    , selectContent
    , HttpDownLoaderState
    , fillUrl
    , cancel
    , downloadPage
  } from './httpdownloaderSlice'

export function HttpDownloader() {
  const dispatch = useDispatch()
  const ct = useSelector(selectContent)
  const st = useSelector(selectState)
  const url = useSelector(selectUrl)
  return (
    <div>
        <input type="text" onInput={evt => dispatch(fillUrl(evt.target.value))} />
      <div class="btn-group" role="group" aria-label="...">
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[1]} onClick={() => dispatch(downloadPage(url))} >start</button>
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[0]} onClick={() => dispatch(cancel())}>stop</button>
      </div>
      <p>{st == HttpDownLoaderState[1] ? "download is in process ..." : ct}</p>
    </div>
  )
}