import './styles.css'

import { EditorContent, BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ReactPlayer from "react-player"
import { getEmbedUrl } from '../../utils/helpers'

const VideoEditorModal = ({ link,vidType, open, closeModal, videoUpdated }) => {
  const [type, setType] = useState(vidType)
  const [videoLink, setVideoLink] = useState(link)

  // const updateVideoTarget = (target) => {
  //   setType(target)
  // }
  const handleSubmit = (e) => {
    e.preventDefault()
    closeModal(false)
    console.log("=====++===", type, videoLink, ".....")
    videoUpdated(type, videoLink)
  }
  return (
    <Dialog open={open} onClose={() => closeModal(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" onSubmit={(e) => { handleSubmit(e) }}>
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-center font-semibold text-gray-900 p-0">
                  Edit Video
                </DialogTitle>
                <div className="mt-2">
                  <div className="sm:col-span-3">
                    <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                      Choose Video Type (YouTube, Vimeo etc...)
                    </label>
                    <div className="mt-2">
                      <select
                        id="type"
                        name="type"
                        required
                        value={type}
                        onChange={(e) => { setType(e.target.value) }}
                        autoComplete="type-name"
                        className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      >
                        <option value={"yt"}>YouTube</option>
                        <option value={"vi"} >Vimeo</option>
                      </select>
                    </div>
                  </div>
                  {/* video link input form */}
                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 pt-2">
                      Video Link
                    </label>
                    <div className="mt-2">
                      <input
                        value={videoLink}
                        onChange={(e) => { setVideoLink(e.target.value) }}
                        id="url"
                        name="url"
                        type="url"
                        required
                        autoComplete="email"
                        className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  {/* <p className="text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                  </p> */}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Video
              </button>
            </div>
          </DialogPanel>
        </form>
      </div>
    </Dialog>
  )
}

export const RichVideoEditor = ({ videoUrl, videoType, editMode, section, onUpdate }) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(videoType)
  const [videoLink, setVideoLink] = useState(videoUrl)


  // const editor = useEditor({
  //   extensions: [
  //     StarterKit
  //   ],
  //   content: section.content.text,
  //   // onUpdate({ editor }) {
  //   //   onInput(editor.getHTML())
  //   // }
  // })

  // const [isEditable, setIsEditable] = React.useState(true)

  // useEffect(() => {
  //   if (editor) {
  //     editor.setEditable(isEditable)
  //   }
  // }, [isEditable, editor])

  return (
    <>
      <VideoEditorModal link={videoUrl} vidType={type} open={open} closeModal={() => setOpen(false)} videoUpdated={(type, link) => {
        console.log("type...>", type, link)
        setType(type);
        setVideoLink(link);
        onUpdate(type, link)
      }} />
      <div className="flex flex-col p-2 ring-1 gap-3">
        {
          type === 'yt' ? (
            <iframe
              width="100%"
              height="420"
              src={getEmbedUrl(videoLink)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <ReactPlayer
              width={"100%"}
              url={videoLink}
              controls
            />
          )
        }
        <Button
          onClick={() => { setOpen(true) }}
          className='bg-blue-200 border-blue-500 text-gray-700 text-sm font-bold'>Edit Video</Button>
      </div>
    </>
  )
}