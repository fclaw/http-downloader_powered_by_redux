import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import
  {   selectUrl
    , selectState
    , selectContent
    , selectId
    , HttpDownLoaderState
    , fillUrl
  } from './httpdownloaderSlice'

export function HttpDownloader() {
  const st = useSelector(selectState)
  const dispatch = useDispatch()
  return (
    <div>
        <input type="text" onInput={evt => dispatch(fillUrl(evt.target.value))} />
      <div class="btn-group" role="group" aria-label="...">
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[1]}>start</button>
        <button type="button" class="btn btn-default" disabled={st == HttpDownLoaderState[0]}>stop</button>
      </div>
      <p>{st == HttpDownLoaderState[1] ? "download is in process ..." : useSelector(selectContent)}</p>
    </div>
  )
}