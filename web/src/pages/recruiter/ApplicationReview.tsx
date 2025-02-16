import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, message, Badge, Alert, Modal, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CheckCircle, ChevronLeftCircle, XCircle } from 'lucide-react';
import api from '../../lib/axios';
import { JobApplication, VideoResponseDTO } from '../../types';
import VideoPlayer from '../../components/common/VideoPlayer';
import ReactPlayer from "react-player";
import { changeApplicationStatus } from "../../apis";

const ApplicantDetails = ({ title, value }: { title: string, value: ReactNode }) => {
    return <>
        <p className={'p-5 bg-[#C1DBFF24] border border-slate-200'}>{title}</p>
        <div className={'p-5 border border-slate-100'}>
            {value}
        </div>
    </>
}

function ApplicationReview() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<VideoResponseDTO[] | null>([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [applicantStatus, setApplicantStatus] = useState(null);
    const [overallRating, setOverallRating] = useState(0);

    const { data: application } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            const { data } = await api.get(`/applications/${id}`);
            refetch();
            return data as JobApplication;
        },
    });

    const { data: videoResponseData, error: videoError, status: videoStatus, refetch } = useQuery({
        queryKey: ['video-responses'],
        queryFn: async () => {
            const { data } = await api.get(`/video-responses`);
            const filteredData = data as VideoResponseDTO[];
            return filteredData;
        },
        enabled: false
    });

    const updateStatus = useMutation({
        mutationFn: () => changeApplicationStatus(application?.id, { status: applicantStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['application', id] });
            message.success('Application status updated successfully');
        },
    });

    useEffect(() => {
        if (videoResponseData && application?.videoResponses) {
            const selectedVidResponse = videoResponseData.filter((item) => {
                const itemId = item?.id;

                if (!itemId) return false;

                const match = application.videoResponses.some((videoResponse) => {
                    return videoResponse.id === itemId;
                });

                return match;
            });

            console.clear()
            console.log(selectedVidResponse, "DselectedVidResponse")
            if (selectedVidResponse.length > 0 && selectedVidResponse !== selectedResponse) {
                setSelectedResponse(selectedVidResponse);
            } else {
                console.log('No matching video responses found.');
            }
            // Calculate overall rating
            const overallRate = selectedVidResponse.reduce((sum, item) => {
                const rating = parseFloat(item.rating); // Parse the rating as a float
                return sum + (isNaN(rating) ? 0 : rating); // Add rating if valid, otherwise add 0
            }, 0) / (selectedVidResponse.length || 1); // Avoid division by zero

            // Set the overall rating



            // set overall rating
            setOverallRating(Math.round(overallRate))
        }
    }, [videoResponseData]);


    if (!application) return null;

    const renderStatusButton = (status: string, label: string, icon: React.ReactNode, color?: 'primary' | 'danger') => (
        <Button
            type={color === 'primary' ? 'primary' : undefined}
            danger={color === 'danger' ? true : undefined}
            icon={icon}
            onClick={() => {
                setApplicantStatus(status)
                updateStatus.mutate()
            }}
        // disabled={application.status === status}
        >
            {label}
        </Button>
    );

    const renderCandidateInfo = () => (
        <div className={'border p-3 rounded-md'}>
            <div className={'flex p-2 justify-between'}>
                <div className={'candidate-avatar flex items-center gap-x-6'}>
                    <img className={'h-32 w-32 rounded-full'}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnE_fy9lLMRP5DLYLnGN0LRLzZOiEpMrU4g&s"
                        alt="" />
                    <div className={'space-y-1'}>
                        <h1 className={'font-bold text-2xl'}>{application.candidate?.firstName} {application.candidate?.lastName}</h1>
                        <p className={'text-lg'}>{application?.candidate?.email}</p>
                        <p className={'text-lg'}>Candidate Rating <b className=' text-green-500' style={{ fontSize: 24 }}>{overallRating}/10</b></p>
                    </div>
                </div>

                <Space>
                    {renderStatusButton('ACCEPTED', 'Shortlist', <CheckCircle className="w-4 h-4" />, 'primary')}
                    {renderStatusButton('REJECTED', 'Reject', <XCircle className="w-4 h-4" />, 'danger')}
                </Space>
            </div>
            <div className={'grid grid-cols-2 mt-2 p-2'}>
                <ApplicantDetails title={'Status'} value={<Tag
                    color={application?.status === 'ACCEPTED' ? 'green' : application?.status === 'REJECTED' ? 'red' : 'blue'}>{application.status?.toUpperCase() || "PENDING"}</Tag>} />
                <ApplicantDetails title={'Phone'} value={<p>{application.candidate?.phoneNumber}</p>} />
                <ApplicantDetails title={'Address'} value={<p>{application.candidate?.address}</p>} />
                <ApplicantDetails title={'Date Applied'} value={<p>{format(new Date(), 'MMM dd, yyy')}</p>} />
            </div>
            {/*<Descriptions column={2}>*/}
            {/*  <Descriptions.Item label="Name">{application.candidate?.firstName} {application.candidate?.lastName}</Descriptions.Item>*/}
            {/*  <Descriptions.Item label="Email">{application.candidate?.email}</Descriptions.Item>*/}
            {/*  <Descriptions.Item label="Phone">{application.candidate?.phoneNumber}</Descriptions.Item>*/}
            {/*  <Descriptions.Item label="Address">{application.candidate?.address}</Descriptions.Item>*/}
            {/*  <Descriptions.Item label="Status">*/}
            {/*    <Tag*/}
            {/*      color={*/}
            {/*        application?.status === 'shortlisted' ? 'green' :*/}
            {/*          application?.status === 'rejected' ? 'red' :*/}
            {/*            'blue'*/}
            {/*      }*/}
            {/*    >*/}
            {/*      {application.status?.toUpperCase() || "PENDING"}*/}
            {/*    </Tag>*/}
            {/*  </Descriptions.Item>*/}
            {/*  <Descriptions.Item label="Applied">*/}
            {/*    {format(new Date(), 'MMM dd, yyyy')}*/}
            {/*  </Descriptions.Item>*/}
            {/*</Descriptions>*/}
        </div>
    );

    const renderVideoResponses = () => (
        <Card title="Interview Response">
            <div className="">
                <div className="space-y-2">
                    <div>
                        {(!selectedResponse || selectedResponse.length === 0) && (
                            // <div className="p-4 border space-y-4 border-slate-300 bg-white rounded-lg">
                            <Alert className={'text-sm font-bold'} message="No video responses found" type="warning" />
                            // </div>
                        )}
                        {(
                            selectedResponse?.map((item, index) => {
                                return <div key={item?.id}
                                    className='px-4 pb-4 border-b mb-6 space-y-4  rounded-lg'>
                                    <div className={'flex items-center justify-between'}>
                                        <p className='text-lg font-bold pb-3 border-b'>Question
                                            #{index + 1}: {item?.question?.text}</p>
                                        <p onClick={() => {
                                            setSelectedVideo(item);
                                            setModalOpen(true);
                                        }} className={'text-blue-600 font-bold cursor-pointer'}>Watch Response Video</p>
                                    </div>
                                    {/*<VideoPlayer url={item?.videoUrl}/>*/}

                                    {/*<h3 className="font-medium pb-2 border-b text-lg">Answer Analysis</h3>*/}
                                    <p className={'p-4 bg-slate-200 border-slate-300 border'}>
                                        <strong
                                            className={'font-bold'}>Transcript</strong>: {item.transcript === "" ? "No transcript available" : item.transcript}
                                    </p>
                                    {/*<p><strong>Summary</strong>: {item.summary}</p>*/}
                                    {/*<p><strong>Feedback</strong>: </p>*/}
                                    {/*<div>*/}
                                    {/*    <div>{item.feedback?.split("\n").map((item) =>*/}
                                    {/*        <p>{item?.replace("**", "").replace("Feedback: ", "")}</p>)}</div>*/}
                                    {/*</div>*/}
                                </div>
                            }))}
                    </div>
                </div>
            </div>
        </Card>
    );

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    return (
        <div className="space-y-6 p-4 rounded-lg border-2 border-slate-100">
            <Modal width={700} className={''} cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }} open={isModalOpen} onClose={handleClose}
                onCancel={handleClose} onOk={handleClose}>
                <div className={'space-y-3'}>
                    <h1 className={'text-lg font-bold'}>Candidate Response</h1>
                    <p className={'border-b pb-3'}><strong>Question: </strong> {selectedVideo?.question?.text} </p>
                    <ReactPlayer height={500} controls={true} url={selectedVideo?.videoUrl} />
                    {!selectedVideo?.question.isIdQuestion &&
                        <div className={'response-review-container space-y-3 mt-3'}>
                            <p className={''}>
                                <strong
                                    className={'font-bold'}>Transcript</strong>: {selectedVideo?.transcript === "" ? "No transcript available" : selectedVideo?.transcript}
                            </p>
                            <p className={'p-4 bg-slate-100 border-slate-300 border'}><strong>Summary</strong>: {selectedVideo?.summary}</p>

                            <div className={'p-4 bg-[#E6F4FF] border-blue-300 border'}>
                                <div>
                                    <strong className={'font-bold text-[#006BFF] text-xl'}>⭐️ RATING: <span
                                        style={{ fontSize: 32 }}>{selectedVideo?.rating ? selectedVideo?.rating : '-'}/10</span></strong>
                                </div>
                            </div>

                            <div className={'p-4 bg-[#E6F4FF] border-blue-300 border'}>
                                <div><strong className={'font-bold text-[#006BFF]'}>AI Feedback: </strong> {selectedVideo?.feedback?.split("\n").map((item) =>
                                    <p>{item?.replace("**", "").replace("Feedback: ", "")}</p>)}</div>
                            </div>
                        </div>}
                </div>
            </Modal>
            <div className="space-y-3">
                <div className={'p-3 border-b gap-3 flex items-start'}>
                    <ChevronLeftCircle className='cursor-pointer' onClick={() => navigate(-1)} />
                    <div className={'space-y-2'}>
                        <p>Application Received</p>
                        <h1 className={'text-3xl font-bold'}>Candidate Details</h1>
                    </div>
                </div>
                {/*<div className='flex items-center justify-start gap-2'>*/}
                {/*  <ChevronLeftCircle className='cursor-pointer' onClick={() => navigate(-1)} />*/}
                {/*  <h1 className="text-2xl font-bold">Application Review</h1>*/}
                {/*</div>*/}
                {/*<Space>*/}
                {/*  {renderStatusButton('shortlisted', 'Shortlist', <CheckCircle className="w-4 h-4" />, 'primary')}*/}
                {/*  {renderStatusButton('rejected', 'Reject', <XCircle className="w-4 h-4" />, 'danger')}*/}
                {/*</Space>*/}
            </div>

            <div className={'flex flex-col items-center justify-center'}>
                {updateStatus?.isPending && <Spin />}
                {/*{updateStatus?.isSuccess && <Alert type={'success'} message={'Applicant status updated successfully'} /> }*/}
                {/*{updateStatus?.isError && <Alert type={'error'} message={'Failed to update applicant status'} /> }*/}
            </div>

            {application && <>
                {renderCandidateInfo()}
                {renderVideoResponses()}</>}
        </div>
    );
}

export default ApplicationReview;
