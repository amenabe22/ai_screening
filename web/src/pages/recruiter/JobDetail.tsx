import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, Space, Modal, Typography, Badge, Input } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowUp, ChevronLeftCircle, Eye, Search } from 'lucide-react';
import api from '../../lib/axios';
import { Job, Application, JobPosting, ApplicationResponse, Candidate, VideoResponseDTO } from '../../types';
import VideoPlayer from '../../components/common/VideoPlayer';
import { PdfViewer } from './PdfViewer';
import { Dialog } from "@headlessui/react";
import ReactPlayer from "react-player";
import { IoFilterOutline } from "react-icons/io5";
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;

export const DashboardJobCard = ({ title, content }: { title: string, content: string }) => {
    return (
        <div className={'p-4 h-50 bg-[#006BFF14] flex flex-col gap-4'}>
            <p className={'pb-3 border-b font-normal'}>{title}</p>
            <div className={'flex gap-3 items-center'}>
                <p className={'font-semibold text-3xl'}>{content}</p>
                <div className={'px-3 py-1 rounded-xl text-xs bg-[#ECFDF3] text-green-800 flex items-center gap-2'}><ArrowUp size={14} className={'text-green-600'} /> <span>20%</span></div>
            </div>
        </div>
    )
}

function JobDetail() {
    const { id } = useParams<{ id: string }>();
    const [jobData, setJobData] = useState<Candidate[]>([]);
    const [isModalOpen, setOpen] = useState(false);
    const [isCloseOpen, setCloseOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<ApplicationResponse | null>(null);
    const [selectedResponse, setSelectedResponse] = useState<VideoResponseDTO[] | null>([]);
    const location = useLocation();
    const navigate = useNavigate();

    const { data: job } = useQuery({
        queryKey: ['job', id],
        queryFn: async () => {
            const { data } = await api.get(`/jobs/${id}`);
            return data as JobPosting;
        },
    });

    const { data: jobApplications, status, isSuccess } = useQuery({
        queryKey: ['job-applications'],
        queryFn: async () => {
            const { data } = await api.get(`/applications`);
            console.log("applications data: ", data)
            return data as ApplicationResponse[];
        },
    });

    // const { data: videoResponseData, error: videoError, status: videoStatus } = useQuery({
    //   queryKey: ['video-responses'],
    //   queryFn: async () => {
    //     const { data } = await api.get(`/video-responses`);
    //     return data as VideoResponseDTO[];
    //   },
    // });

    const columns = [
        {
            title: 'Candidate Name',
            dataIndex: ['name'],
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        // {
        //     title: 'Address',
        //     dataIndex: ['address'],
        //     key: 'address',
        // },
        // {
        //     title: 'Contact',
        //     dataIndex: ['phoneNumber'],
        //     key: 'phoneNumber',
        // },
        {
            title: '',
            key: '',
            render: (_: any, record: Candidate) => (
                <Button
                    type="primary"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => {
                        const selectedJob = jobApplications?.find(
                            (application) => application.candidate.id === record.id
                        )

                        // const selectedVidResponse = videoResponseData?.filter((item) => item?.application?.id === selectedJob?.id);

                        // console.log("VID: ", selectedVidResponse);
                        // console.log("selectedJob", selectedJob);

                        // if (selectedVidResponse && selectedVidResponse?.length > 0) {
                        //   setSelectedResponse(selectedVidResponse);
                        // }

                        // if (selectedJob) {
                        //   setSelectedJob(selectedJob);
                        //   setOpen(true);
                        // }

                        navigate(`/applications/${selectedJob?.id}`);
                    }}
                >
                    Review
                </Button>
            ),
        },
    ];

    useEffect(() => {
        console.log("LOG: jobApplications", jobApplications)
        if (jobApplications && jobApplications?.length > 0) {
            const filteredApplications = jobApplications.filter(
                (item) => item.job?.id === Number(id)
            );

            const candidates = filteredApplications.map(
                (application) => application.candidate
            );

            setJobData(candidates);
        }
    }, [jobApplications, id]);

    function encodeFileName(fileName: string): string {
        return fileName
            .replace(/ /g, '%20')  // Encode spaces as %20
            .replace(/#/g, '%23')   // Encode # as %23
            .replace(/\(/g, '%28')   // Encode ( as %28
            .replace(/\)/g, '%29')   // Encode ) as %29
            .replace(/&/g, '%26')    // Encode & as %26
            .replace(/'/g, '%27')    // Encode ' as %27
            .replace(/"/g, '%22')    // Encode " as %22
            .replace(/,/g, '%2C')    // Encode , as %2C
            .replace(/;/g, '%3B');   // Encode ; as %3B
    }

    if (!job) return null;

    console.log("JOB: ", job);

    return (
        <div className="space-y-4">
            <Modal
                width={1000}
                open={isModalOpen}
                onCancel={() => setOpen(false)}
                title="Job Application Details"
            >
                <div className='flex items-start flex-col gap-2 gap-x-4 p-4'>
                    <div className='flex flex-col gap-y-3 p-3 border border-slate-200 rounded-md w-full'>
                        <h1 className='text-2xl font-semibold'>Applicant Details: </h1>
                        <h1>Full Name: {selectedJob?.candidate?.firstName + " " + selectedJob?.candidate?.lastName}</h1>
                        <h2>Email: {selectedJob?.candidate?.email}</h2>
                        <h2>Phone: {selectedJob?.candidate?.phoneNumber}</h2>
                        <h2>Address: {selectedJob?.candidate?.address}</h2>
                    </div>
                    <div className='w-full'>
                        <h1 className='text-2xl font-semibold pb-2 border-b'>Resume: </h1>
                        <iframe
                            src={encodeFileName(selectedJob?.candidate?.resumeUrl || "")}
                            width={"100%"}
                            height={600}

                        ></iframe>
                        {/* {selectedJob?.candidate?.resumeUrl && <PdfViewer url={encodeFileName(selectedJob?.candidate?.resumeUrl || "")} />} */}
                    </div>
                </div>
                <div className='mt-4'>
                    <h1 className='text-xl font-semibold pb-2 border-b bg-slate-100 mb-3'>Video Responses: </h1>
                    {selectedResponse && selectedResponse?.length > 0 && (
                        selectedResponse?.map((item) => {
                            return <div key={item?.id} className='p-4 mb-6 border border-slate-300 bg-white rounded-lg'>
                                <h1 className='text-lg font-semibold mb-2'>Question: {item?.question?.text}</h1>
                                <h1 className='text-sm mb-2'>Video Response: </h1>
                                <VideoPlayer url={item?.videoUrl} />

                                <div className='p-3 mt-3'>
                                    <h3 className="font-medium pb-2 border-b text-lg">Answer Analysis</h3>
                                    <p>
                                        <strong>Transcript</strong>: {item.transcript === "" ? "No transcript available" : item.transcript}
                                    </p>
                                    <p><strong>Summary</strong>: {item.summary}</p>
                                    <p><strong>Feedback</strong>: </p>
                                    <div>
                                        <div>{item.feedback?.split("\n").map((item) =>
                                            <p>{item?.replace("**", "").replace("Feedback: ", "")}</p>)}</div>
                                    </div>
                                </div>
                            </div>
                        })
                    )}
                </div>
            </Modal>

            <Modal
                width={500}
                open={isCloseOpen}
                onCancel={() => setCloseOpen(false)}
                title="Close Job"
                onOk={() => setCloseOpen(false)}
            >
                <p>Are you sure you want to close this job?</p>
            </Modal>

            <div
                className='flex items-center justify-between gap-2 w-full  bg-white py-4 px-2'>
                <div className={'flex flex-col items-start justify-start gap-3'}>
                    {/*<ChevronLeftCircle fontSize={24} className='cursor-pointer' onClick={() => navigate(-1)}/>*/}
                    <h1 className="text-4xl font-bold">{job.companyPortal?.name}</h1>
                    <div className={'flex gap-3'}>
                        <p>Job Listing</p>
                        <span>/</span>
                        <p className={'text-blue-600'}>{job.title}</p>
                    </div>
                </div>
                <div className={'flex items-center gap-2'}>
                    <Button type='default' onClick={() => setCloseOpen(true)}>Close
                        Job</Button>
                    <Button type="primary">Edit Job</Button>
                </div>
            </div>

            <div className={'grid grid-cols-4 gap-4'}>
                <DashboardJobCard title={'Total Applicants'} content={'1300'} />
                <DashboardJobCard title={'Screened Applicants'} content={'500'} />
                <DashboardJobCard title={'Qualified Applicants'} content={'340'} />
                <DashboardJobCard title={'Acceptance Rate'} content={'50%'} />
            </div>

            {/*<Card className={'border-none'} bordered={false} title="Job Descriptions">*/}
            {/*    <Paragraph className={'border-none'}>{job?.description}</Paragraph>*/}
            {/*</Card>*/}

            <div className={'flex flex-col gap-3 p-3 '}>
                <h1 className={'opacity-60 text-xl'}>Job Descriptions</h1>
                <p className={'font-light leading-6 border-b pb-4'}>{job.description} <span className={'text-blue-600 border-b cursor-pointer font-semibold'}>See more</span></p>
            </div>

            <div className={'flex flex-col gap-3 p-3'}>
                <h1 className={'opacity-60 text-xl'}>Interview Questions</h1>
                <ol className='ml-2 space-y-2 pb-4 border-b'>
                    {job.questions.map((question, index) => (
                        <li key={question.id}>
                            {index + 1 + ". " + question.text}
                        </li>
                    ))}
                </ol>
            </div>

            <div className='p-6 shadow-lg space-y-4 border border-slate-200'>
                <h1 className='text-xl font-semibold'>Applicants</h1>
                <div className='flex justify-between items-center'>
                    <Input
                        placeholder="Search"
                        prefix={<Search className="w-4 h-4 text-gray-400" />}
                        className="w-80"
                    />
                    <div className='flex gap-2 items-center'>
                        <RangePicker className='h-12 rounded-none' />
                        <Button type="default" icon={<IoFilterOutline className="w-4 h-4" />}>Filter</Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={jobData ? jobData : []}
                    rowKey="id"
                />
            </div>
        </div>
    );
}

export default JobDetail;