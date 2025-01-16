import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Upload, message } from 'antd';
import { Typography } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Candidate } from '../../types';
import { uploadToS3 } from "../../apis";
import SpotteoLogo from '../../assets/images/spotteo-logo-black.png';

const { Title, Text } = Typography;

function InterviewInstruction() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const applicationId = searchParams.get('applicationId');

    const continueToInterview = () => {
        navigate(`/candidate/jobs/${id}/interview?applicationId=${applicationId}`);
    }

    return (
        <div className="lg:w-2/3 mx-auto space-y-6 bg-white">
            <div className={'flex items-center justify-center w-full'}>
                <p>AI Video Screening</p>
            </div>
            <div className={'p-6 border mt-3'}>
                <div className={'py-6 space-y-3'}>
                    <h1 className="text-4xl text-center font-bold">What To Expect</h1>
                    {/*<p className={'text-center text-sm'}>Video Interview Instructions</p>*/}
                </div>

                <div className={'content-instructions space-y-4 leading-6 mb-6'}>
                    <p>In the following steps, you will be asked a series of questions related to the position. For each question, you’ll be recorded on video. The recording will start automatically after a brief countdown, and you will have only one attempt to give your best answer. Once you move forward, you won’t be able to pause, rewind, or re-record your response. Think carefully before you begin—once you press “Start,” the process will continue without going back.</p>

                    <div className={'space-y-2'}>
                        <p className={'font-bold mb-0 leading-normal'}>Tips for success: </p>
                        <ul className={'list-disc ml-6'}>
                            <li>
                                Make sure you’re in a quiet, well-lit space.
                            </li>
                            <li>
                                Review the question, then gather your thoughts quickly.
                            </li>
                            <li>
                                Speak clearly, confidently, and stay focused on the topic.
                            </li>
                        </ul>
                    </div>

                    <p>
                        When you’re ready, click “Next” to begin. Good luck!
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <Button onClick={() => navigate(-1)}>Cancel</Button>
                    <Button
                        type="primary"
                        onClick={continueToInterview}
                    >
                        Continue to Video Interview
                    </Button>
                </div>
            </div>

        </div>
    );
}

export default InterviewInstruction;