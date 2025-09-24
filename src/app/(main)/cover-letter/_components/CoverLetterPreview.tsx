"use client"
import React from 'react'
import MDEditor from '@uiw/react-md-editor'

const CoverLetterPreview = ({content}: {content: string}) => {
  return <MDEditor height={800} value={content}  preview='preview'/>
}

export default CoverLetterPreview