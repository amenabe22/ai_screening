import { v4 } from "uuid"
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tiptap } from "../../components/editor/RichEditorTipTap";
import { RichVideoEditor } from "../../components/editor/RichVideoEditorTipTap";
import { Alert, Button, message, Spin } from "antd";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Colorful } from '@uiw/react-color';
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import api from "../../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";


const templates = {
  template1: {
    sections: [
      { id: 'section1', type: 'headline', content: { text: '<h1 style="text-align: center"><strong>Welcome to Our Company</strong></h1>' }, style: '' },
      { id: 'section2', type: 'subheadline', content: { text: '<h3 style="text-align: center">Put your website subheadline here!</h3>' }, style: '' },
      { id: 'section3', type: 'video', content: { videoUrl: 'https://www.youtube.com/watch?v=NpEaa2P7qZI&ab_channel=TristanBrehaut', videoType: "yt" }, style: '' },
      {
        id: 'section4', type: 'button', content: {
          text: 'Get Started with $5 for 5 days offer',
          link: 'https://example.com/',
          bgColor: "#eeee", txtColor: "#000000"
        }, style: ''
      },
    ]
  }
};

const EditButtonModal = ({ bgColor, txColor, open, link, closeMdal, buttonSubmitted }) => {
  const [btnLink, setBtnLink] = useState(link)
  const [color, setColor] = useState(bgColor)
  const [txtColor, setTxtColor] = useState(txColor)

  const buttonEdited = (e) => {
    e.preventDefault()
    buttonSubmitted({ btnLink, color, txtColor })
  }
  return (
    <Dialog open={open} onClose={() => closeMdal(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" onSubmit={(e) => { buttonEdited(e) }}>
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3 text-center">
                <DialogTitle as="h1" className="text-center font-semibold text-gray-900 p-0">
                  Edit Button
                </DialogTitle>
                <div className="mt-4">
                  <div className="sm:col-span-3">
                    {/* <label htmlFor="type" className="block text-sm/6 font-medium pb-2 text-gray-900">
                      Add Button Color
                    </label> */}
                    <div>
                      <div className="mt-2 flex justify-center gap-10">
                        <div>
                          <p className="font-medium pb-2">Button Background</p>
                          <Colorful color={color}
                            onChange={(color) => {
                              setColor(color.hex);
                            }} />
                        </div>
                        <div>

                          <p className="font-medium pb-2">Button Text</p>
                          <Colorful color={txtColor}
                            onChange={(color) => {
                              setTxtColor(color.hex);
                            }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="type" className="block text-sm/6 py-2 font-medium text-gray-900">
                      Add Button Link
                    </label>
                    <div className="mt-2">
                      <input
                        value={btnLink}
                        onChange={(e) => { setBtnLink(e.target.value) }}
                        id="url"
                        name="url"
                        type="url"
                        required
                        autoComplete="email"
                        className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </form>
      </div>
    </Dialog>
  );
}
export default function PortalBuilder() {
  const [editMode, setEditMode] = useState(true)
  const [sections, setSections] = useState<any>([]);
  const [openModal, setOpenModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)
  const [recruiter, setRecruiter] = useState<any>(null);
  const { user } = useUser();

  const { data: recruiterData, isLoading: recruiterLoading, isError: recruiterError, isSuccess } = useQuery({
    queryKey: ['recruiters'],
    queryFn: async () => {
      const response = await api.get(`/recruiters`);
      console.log("RES: ", response);
      return response.data;
    }
  });

  const { data: portals, isLoading: portalLoading, isError: portalError, isSuccess: portalSuccess, refetch: portalRefetch } = useQuery({
    queryKey: ['portals'],
    queryFn: async () => {
      const { data } = await api.get(`/portals/recruiter/${recruiter?.id}`);

      if (data) {
        let template1 = data?.htmlContent;
        const savedSections = JSON.parse(template1).sections
        setSections([]);
        setSections(savedSections);
      } else {
        setSections(templates.template1.sections)
      }
      return data;
    },
    enabled: false
  });

  useEffect(() => {
    recruiterData && console.log("USER: ", recruiterData);
    if (isSuccess) {
      const recruiterItem = recruiterData.find((item: any) => item?.email === user?.primaryEmailAddress?.emailAddress);
      console.log("REC: ", recruiterItem?.id);
      setRecruiter(recruiterItem);
    }
  }, [isSuccess]);

  const componentAdded = (data, section, index) => {
    console.log("selected: ", data);
    console.log("Selected: ", data);

    // Default new section data
    const headerSection = {
      id: v4(), // Generate a unique ID
      type: 'headline',
      content: { text: '<h1 style="text-align: center">New Header</h1>' }, // Default content
      style: '',
    };
    const subHeaderSection = {
      id: v4(), // Generate a unique ID
      type: 'subheadline',
      content: { text: '<h3 style="text-align: center">New Section Content</h3>' }, // Default content
      style: '',
    };
    const buttonSection = {
      id: v4(), // Generate a unique ID
      type: 'button', content: {
        text: 'Get Started with $5 for 5 days offer',
        link: 'https://example.com/',
        bgColor: "#eeee", txtColor: "#000000"
      }, style: ''
    };
    const videoSection = {
      id: v4(), // Generate a unique ID
      type: 'video',
      content: { videoUrl: 'https://www.youtube.com/watch?v=NpEaa2P7qZI&ab_channel=TristanBrehaut', videoType: "yt" },
      style: ''
    };

    let sectionItem;

    if (data == 'headline') {
      sectionItem = headerSection
    } else if (data === 'subheadline') {
      sectionItem = subHeaderSection
    } else if (data === 'button') { sectionItem = buttonSection }
    else if (data === 'video') { sectionItem = videoSection }
    const updatedSections = [...sections];
    updatedSections.splice(index + 1, 0, sectionItem);

    setSections(updatedSections);
  }

  const deleteSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  }

  useEffect(() => {
    if (recruiter) {
      portalRefetch();
    }
  }, [recruiter]);

  // useEffect(() => {
  //   if (recruiter && portals) {
  //     let template1 = portals?.htmlContent;
  //     const savedSections = JSON.parse(template1).sections
  //     setSections([]);
  //     setSections(savedSections);
  //     console.log("Sections: ", sections);
  //   } else {
  //     setSections(templates.template1.sections);
  //   }
  // }, [portalSuccess]);

  const handleDragEnd = (result) => {
    console.log("drag end trigger")
    if (!result.destination) return;
    const reorderedSections = Array.from(sections);
    const [removed] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, removed);
    setSections(reorderedSections);
  };

  const editSectionVideoContent = ({ id }, { type, link }) => {
    const updatedSections = sections.map((section) =>
      section.id === id
        ? { ...section, content: { ...section.content, videoUrl: link, videoType: type } }
        : section
    );
    setSections(updatedSections);
  }

  const editSectionContent = (id, text) => {
    const updatedSections = sections.map((section) =>
      section.id === id
        ? { ...section, content: { ...section.content, text } }
        : section
    );
    setSections(updatedSections);
  }

  const mutatePortal = useMutation({
    mutationKey: ['portal'],
    mutationFn: () => {
      const dataToSave = {
        title: "Portal 1",
        description: "Portal 1 description",
        htmlContent: JSON.stringify({ sections: templates.template1.sections }),
        recruiterId: recruiter?.id || 0
      }

      return api.post('/portals', dataToSave);
    },
    onSuccess: (data) => {
      console.log("portal created successfully");
      message.success('Portal created successfully');
      portalRefetch();
    },
    onError: (err) => {
      console.log("failed to create portal");
      message.warning("Failed to create portal");
    }
  })

  const updatePortal = useMutation({
    mutationKey: ['portal'],
    mutationFn: () => {
      const dataToSave = {
        title: "Portal 1",
        description: "Portal 1 description",
        htmlContent: JSON.stringify({ sections: sections }),
        recruiterId: recruiter?.id || 0
      }

      return api.patch(`/portals/${portals?.id}`, dataToSave);
    },
    onSuccess: (data) => {
      message.success('Portal updated successfully');
      portalRefetch();
    },
    onError: (err) => {
      message.warning("Failed to create portal");
    }
  })

  const saveSiteChanges = () => {
    if (!portals) {
      mutatePortal.mutate();
    } else {
      updatePortal.mutate();
    }
  }

  return (
    <div className="flex flex-col items-center">

      <div className="flex justify-between w-full px-5">
        <div className="text-[#5391ff] font-bold text-xl">My Job Portal</div>
        <h1></h1>
        <div className="flex justify-center gap-3">
          <a href={portals ? `/portal/${portals?.id}` : "#"} target="_blank" className="flex ring-2 rounded-xl p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="#5391ff" aria-hidden="true"
              className="size-5"><path stroke-linecap="round" stroke-linejoin="round"
                d="M21 9V3m0 0h-6m6 0l-8 8m-3-6H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 7.28 3 8.12 3 9.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C5.28 21 6.12 21 7.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C19 18.72 19 17.88 19 16.2V14"></path></svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg> */}
          </a>
          <button className="ring-2 rounded-3xl px-4 flex items-center gap-2 text-[#5391ff] font-bold" onClick={() => saveSiteChanges()}>
            <p>
              Publish Site
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-4xl w-full border-dotted border-3 p-5 border-gray-200 mt-5">
        {portalLoading || recruiterLoading && <Spin size="large" />}
        {portalError || recruiterError && <Alert message="Error loading portal" type="error" />}
        {sections && <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => (
                  <>
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 border-2 border-dashed border-blue-300 rounded mb-6 relative"
                        >
                          <button className="p-1 bg-red-100 rounded-full absolute z-[2] bottom-0 -mt-4 -mr-2 h-7 w-7 flex justify-center" style={{
                            // left: "55%",
                            // transform: "translate(-50%, -50%)",
                            right: 0,
                            top: 0
                          }}
                            onClick={() => deleteSection(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                              className="text-gray-600 size-8 pb-[10px]">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="p-1 bg-blue-200 rounded-full absolute z-[2] bottom-0 -mb-8 h-8 w-h-8 flex justify-center" style={{
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                          >
                            <Menu as="div" className="relative inline-block text-left">

                              <div className="">
                                <MenuButton className={"px-1 outline-none"}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                                  </svg>
                                </MenuButton>

                                {/* <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-semibold text-gray-900 shadow-sm">
                                  <PlusIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                </MenuButton> */}
                              </div>


                              <MenuItems
                                transition
                                className="absolute right-0 left-10 z-50 mt- w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                              >
                                <div className="py-1">
                                  <MenuItem >
                                    <a onClick={(e) => componentAdded("headline", section, index)}
                                      className="block px-4 py-2 text-sm font-semibold text-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                      Main Header
                                    </a>
                                  </MenuItem>
                                  <MenuItem>
                                    <a onClick={(e) => componentAdded("subheadline", section, index)}
                                      className="block px-4 py-2 text-sm font-semibold  text-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                      Subheadline
                                    </a>
                                  </MenuItem>
                                  <MenuItem>
                                    <a onClick={(e) => componentAdded("button", section, index)}
                                      className="block px-4 py-2 text-sm font-semibold  text-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                      Button
                                    </a>
                                  </MenuItem>
                                  <MenuItem>
                                    <a onClick={(e) => componentAdded("video", section, index)}
                                      className="block px-4 py-2 text-sm font-semibold  text-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                      Video
                                    </a>
                                  </MenuItem>
                                </div>
                              </MenuItems>

                            </Menu>
                          </div>
                          {section.type === 'headline' && (
                            <div>
                              <div className="cursor-auto">
                                <Tiptap editMode={editMode} section={section} onInput={htmlContent => editSectionContent(section.id, htmlContent)} />
                              </div>
                            </div>

                          )}
                          {section.type === 'subheadline' && (
                            <div>
                              <div className="cursor-auto">
                                <Tiptap editMode={editMode} section={section} onInput={htmlContent => editSectionContent(section.id, htmlContent)} />
                              </div>
                            </div>
                          )}
                          {section.type === 'video' && (
                            <div>
                              <RichVideoEditor videoUrl={section.content.videoUrl} videoType={section.content.videoType} editMode={editMode} section={section}
                                onUpdate={(type, link) => {
                                  editSectionVideoContent(section, { type, link })
                                }}
                              />
                              {/* <video src={section.content.videoUrl} controls className="w-full" /> */}
                            </div>
                          )}
                          {section.type === 'button' && (
                            <div className="text-center flex flex-col items-end gap-2">
                              <EditButtonModal link={section.content.link}
                                bgColor={section.content.bgColor}
                                txColor={section.content.txtColor}
                                buttonSubmitted={({ btnLink, color, txtColor }) => {
                                  setOpenModal(false);
                                  console.log("DAWG: ", selectedSection)
                                  const updatedSections = sections.map((section) =>
                                    section.id === selectedSection?.id
                                      ? { ...section, content: { ...section.content, link: btnLink, bgColor: color, txtColor } }
                                      : section
                                  );
                                  setSections(updatedSections)
                                }} open={openModal} closeMdal={() => {
                                  setOpenModal(false);
                                }} />
                              <a href={editMode ? '#' : section.content.link} className="w-full cursor-text text-lg p-4 font-semibold"
                                contentEditable={editMode}
                                suppressContentEditableWarning
                                onInput={e => editSectionContent(section.id, e.currentTarget.textContent)}
                                ref={(el) => {
                                  if (el && el.textContent !== section.content.text) {
                                    // Prevent overwriting user input
                                    el.textContent = section.content.text;
                                  }
                                }}
                                style={{
                                  background: section.content.bgColor,
                                  color: section.content.txtColor
                                }}
                                onBlur={(e) => e.currentTarget.textContent = section.content.text} // Sync on blur
                              ></a>
                              <div>

                                <Button
                                  onClick={() => {
                                    setOpenModal(true);
                                    setSelectedSection(section);
                                  }}
                                  className='bg-blue-200 border-blue-500 text-gray-700 text-sm font-bold'>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  </>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>}
      </div>

    </div>
  )
}
