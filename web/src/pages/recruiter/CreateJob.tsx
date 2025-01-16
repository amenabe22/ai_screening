import React, { useEffect, useState } from 'react';
import { Form, Card, message, Space, Spin, Alert } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import QuestionList from '../../components/recruiter/QuestionList';
import api from '../../lib/axios';
import { OnboardingData } from '../../types';
import BrandForm from "../../components/recruiter/BrandForm.tsx";
import { Button, Steps } from 'antd';
import { JobDetailForm } from "../../components/recruiter/JobDetailForm.tsx";
import { AxiosResponse } from "axios";
import { uploadToS3 } from "../../apis";
import WelcomeVideo from "../../components/recruiter/WelcomeVideo.tsx";
import { HeadersForm } from "../../components/recruiter/portal-forms/HeadersForm.tsx";
import CompanyRecorder from "../../components/recruiter/portal-forms/CompanyRecorder.tsx";
import { useUser } from '../../store/authStore.ts';

const jobTemplates = [
    {
        title: 'Software Engineer',
        description: 'We are seeking a talented Software Engineer to join our development team...',
        requirements: '4+ Years',
        questions: [
            'Tell us about a challenging project you worked on and how you solved it.',
            'How do you keep up with new technologies and industry trends?',
            'Describe your experience with agile development methodologies.',
        ],
        company: 'Company description here',
        location: 'On-site',
        tags: ['Engineering', 'Tech', 'Remote', 'Full Stack'],
        jobType: 'Full-time'
    },
    {
        title: 'Product Manager',
        description: 'We\'re looking for an experienced Product Manager to drive product strategy...',
        requirements: '3+ Years',
        questions: [
            'Describe a product you launched from concept to completion.',
            'How do you prioritize features in your product roadmap?',
            'Tell us about a time you had to make a difficult product decision.',
        ],
        company: 'Company description here',
        location: 'On-site',
        tags: ['Product Owner', 'Scrum', 'Remote'],
        jobType: 'Full Time'
    },
];

function CreateJob() {
    const { user } = useUser();
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({});
    const queryClient = useQueryClient();
    const [current, setCurrent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);
    const [submitEnabled, toggleSubmit] = useState(true);
    const navigate = useNavigate();
    const baseUri = import.meta.env.VITE_BASE_URI;

    const welcomeForm = {
        title: 'Welcome Video',
        content: <WelcomeVideo toggleSubmit={toggleSubmit} form={form} />
    };

    const hideStep = () => {
        console.log(steps.length);
        setSteps(steps.filter((item, index) => item !== welcomeForm));
    }

    const showStep = () => {
        setSteps([...steps, welcomeForm]);
    }

    const [steps, setSteps] = useState([
        // {
        //     title: 'Job Posting',
        //     content: <HeadersForm />,
        // },
        // {
        //     title: 'Video Submission',
        //     content: <CompanyRecorder toggleSubmit={toggleSubmit} form={form} />,
        // },
        {
            title: 'Application Page',
            content: <JobDetailForm />,
        },
        {
            title: 'Interview Questions',
            content: <QuestionList form={form} />,
        }
    ]);

    useEffect(() => {
        console.log("STEPS: ", steps);
    }, [steps]);

    const copyJobLink = (val: string) => {
        navigator.clipboard.writeText(val);
        message.success('Job link copied successfully');
    }

    const next = async () => {
        try {
            await form.validateFields();

            setFormData({
                ...formData,
                [steps[current].title]: form.getFieldsValue(),
            });

            setCurrent(current + 1);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const createQuestions = useMutation({
        mutationFn: async (values: any) => {
            return await api.post('/questions/batch', values);
        },
        onSuccess: (data) => {
            console.log("DATA: ", data);
            message.success('Questions created successfully');
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['jobs'] });

            setTimeout(() => {
                navigate('/jobs');
            }, 2000);
        },
        onError: (err) => {
            console.log("ERR: ", err)
        }
    });

    const createBranding = useMutation<AxiosResponse<OnboardingData>, any>({
        mutationKey: ['brand'],
        mutationFn: (data: any) => {
            return api.post('/company-portal', data);
        },
        onSuccess: (data) => {
            console.log("DATA: ", data.data);
            message.success('Portal created successfully');

            copyJobLink(`${baseUri}/portal/${data.data.id}`);

            createJob.mutate({
                title: form.getFieldValue('title'),
                description: form.getFieldValue('description'),
                recruitedId: user?.recruiter?.id,
                companyPortalId: data?.data?.id,
                brandId: 1212,
            });
        },
        onError: (err) => {
            console.log("ERR Brand Setup: ", err);
        }
    });

    const createJob = useMutation({
        mutationFn: async (values: any) => {
            return await api.post('/jobs', values);
        },
        onSuccess: (data: any) => {
            const questionsList = [];

            queryClient.invalidateQueries({ queryKey: ['jobs'] });

            if (!form.getFieldValue('questions')) {
                message.success('Job created successfully');
                form.resetFields();
                return;
            }

            for (let i = 0; i < form.getFieldValue('questions').length; i++) {
                questionsList.push({
                    text: form.getFieldValue('questions')[i].text,
                    jobPostingId: data?.data?.id,
                    timer: form.getFieldValue('questions')[i].timer?.toString() || ''
                });
            }

            console.log("questionsList: ", form.getFieldValue('questions'));
            // copyJobLink(`${baseUri}/candidate/jobs/${data?.data?.id}`);

            createQuestions.mutate(
                [...questionsList.map((e) => {
                    return { ...e, job_id: data?.data?.id }
                })]
                // jobPostingId: data?.data?.id,
                // questions: questionsList
            );
        },
    });

    const handleJobSubmission = async (values) => {
        const recruiterId = 1;
        setFormData({
            ...formData,
            [steps[current].title]: values,
        });

        console.log("FORM VALUES: ", formData);

        // let companyHeaderData = formData['Company Info'];
        // const welcomeVideo = formData['Video Submission'];

        // const welcomeUploadedRecording = form.getFieldValue('video');
        // const welcomeYoutubeUrl = welcomeVideo?.welcomeVideoUrl;
        // console.log("W: ", welcomeYoutubeUrl);
        // if(welcomeYoutubeUrl?.file) {
        //     setFileLoading(true);
        //     const videoUrl = await uploadToS3(welcomeYoutubeUrl?.file);
        //     companyHeaderData = {
        //         ...companyHeaderData,
        //         welcomeVideoUrl: videoUrl
        //     }
        //     setFileLoading(false)
        // }

        // if(typeof welcomeVideo?.welcomeVideoUrl === 'string') {
        //     companyHeaderData = {
        //         ...companyHeaderData,
        //         welcomeVideoUrl: welcomeVideo?.welcomeVideoUrl
        //     }
        // }

        // if(welcomeUploadedRecording && welcomeUploadedRecording !== '') {
        //     console.log('UPLOADED');
        //     companyHeaderData = {
        //         ...companyHeaderData,
        //         welcomeVideoUrl: welcomeUploadedRecording
        //     }
        // }

        // formData['Company Info'] = companyHeaderData;

        setFileLoading(false);
        createJob.mutate({
            title: form.getFieldValue('title'),
            description: form.getFieldValue('description'),
            recruiter_id: recruiterId,
        });
        // const allData = {
        //     name: formData['Job Posting'].name,
        //     description: formData['Job Posting'].description,
        //     videoLink: formData['Company Info'].welcomeVideoUrl,
        //     header: formData['Job Posting'].header,
        //     recruiterId: user?.recruiter?.id
        // }

        // createBranding.mutate(allData);
    }

    return (
        <div className="lg:max-w-5xl w-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Create Job</h1>
            </div>

            <Card className={'rounded-none'}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleJobSubmission}
                >
                    <Steps current={current} items={items} />

                    <div className="mt-4">{steps[current].content}</div>

                    <div className={'flex justify-between'} style={{ marginTop: 24 }}>
                        <p>{current + 1} of {steps.length}</p>
                        <div>
                            {current < steps.length - 1 && (
                                <Button disabled={!submitEnabled} type="primary" onClick={() => next()}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button
                                    disabled={!submitEnabled || createJob.isPending || createBranding.isPending || fileLoading}
                                    type="primary"
                                    htmlType="submit"
                                    loading={createJob.isPending}
                                    icon={<PlusOutlined />}
                                >
                                    Create Job
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                    Previous
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={'m-4 flex items-center justify-center'}>
                        {(createJob.isPending || createBranding.isPending || fileLoading) && <Spin />}
                        {createJob?.error && <Alert message={createJob?.error?.message} type={"error"} />}
                        {createBranding?.error && <Alert message={createBranding?.error?.message} type={"error"} />}
                    </div>

                    {/*<Form.Item>*/}
                    {/*  <div className="flex justify-end gap-4 mt-4">*/}
                    {/*    <Button onClick={() => navigate('/jobs')}>Cancel</Button>*/}

                    {/*  </div>*/}
                    {/*</Form.Item>*/}
                </Form>
            </Card>
        </div>
    );
}

export default CreateJob;