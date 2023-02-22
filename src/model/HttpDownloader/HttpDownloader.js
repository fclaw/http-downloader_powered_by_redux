import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUrl, selectState, selectContent, selectId } from './httpdownloaderSlice'

export function HttpDownloader() {
  return (
    <div>
        <input type="text" />
      <div class="btn-group" role="group" aria-label="...">
        <button type="button" class="btn btn-default">start</button>
        <button type="button" class="btn btn-default">stop</button>
      </div>
      <p>download is in process ...</p>
      <p>the space for a downloaded content</p>
    </div>
  )
}