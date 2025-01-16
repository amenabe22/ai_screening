import React, {useEffect, useState} from 'react';
import {Form, Card, message, Space, Spin, Alert} from 'antd';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {PlusOutlined} from '@ant-design/icons';
import QuestionList from '../../components/recruiter/QuestionList';
import api from '../../lib/axios';
import {OnboardingData} from '../../types';
import BrandForm from "../../components/recruiter/BrandForm.tsx";
import {Button, Steps} from 'antd';
import {JobDetailForm} from "../../components/recruiter/JobDetailForm.tsx";
import {AxiosResponse} from "axios";
import {uploadToS3} from "../../apis";
import WelcomeVideo from "../../components/recruiter/WelcomeVideo.tsx";
import {HeadersForm} from "../../components/recruiter/portal-forms/HeadersForm.tsx";
import CompanyRecorder from "../../components/recruiter/portal-forms/CompanyRecorder.tsx";
import Portals from "./Portals.tsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.tsx";
import { DownloadCloud, Plus } from 'lucide-react';
import {useUser} from "../../store/authStore.ts";

function CompanyPortal() {
    const [recruiter, setRecruiter] = React.useState<any>(null);
    const {user} = useUser();
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
        //     title: 'Company Info',
        //     content: <HeadersForm />,
        // },
        {
            title: 'Video Submission',
            content: <CompanyRecorder toggleSubmit={toggleSubmit} form={form} />,
        }
    ]);

    useEffect(() => {
        console.log("STEPS: ", steps);
    }, [steps]);

    const copyJobLink = (val: string) => {
        navigator.clipboard.writeText(val);
        message.success('Portal link copied successfully');
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

    const items = steps.map((item) => ({key: item.title, title: item.title}));

    const {data: recruiterData, isLoading: recruiterLoading, isError: recruiterError, isSuccess} = useQuery({
        queryKey: ['recruiters'],
        queryFn: async () => {
            const response = await api.get(`/recruiters/`);
            console.log("RES: ", response);
            return response.data;
        }
    });

    const {data: portalList, isLoading: portalLoading, isError: portalError} = useQuery({
        queryKey: ['portal'],
        queryFn: async () => {
            const response = await api.get(`/company-portal/recruiter/email/${user?.recruiter?.email}`);
            console.log("RES PORTALS: ", response);
            return response.data;
        },
    });

    useEffect(() => {
        if (isSuccess) {
            const recruiterItem = recruiterData.find((item: any) => item?.email === user?.primaryEmailAddress?.emailAddress);
            console.log("REC: ", recruiterItem);
            setRecruiter(recruiterItem);
        }
    }, [isSuccess])

    const createBranding = useMutation<AxiosResponse<OnboardingData>, any>({
        mutationKey: ['brand'],
        mutationFn: (data: any) => {
            return api.post('/company-portal', data);
        },
        onSuccess: (data) => {
            console.log("DATA: ", data.data);
            message.success('Portal created successfully');

            copyJobLink(`${baseUri}/portal/${data.data.id}`);

            form.resetFields();

            setTimeout(() => {
                navigate('/jobs');
            }, 2000);
        },
        onError: (err) => {
            console.log("ERR Brand Setup: ", err);
        }
    });

    const handlePortalSubmit = async (values) => {
        setFormData({
            ...formData,
            [steps[current].title]: values,
        });

        console.log("FORM VALUES: ", await form.getFieldsValue());

        let companyHeaderData = formData['Company Info'];
        const welcomeVideo = formData['Video Submission'];

        const welcomeVideoData = form.getFieldsValue('welcomeVideoUrl')?.welcomeVideoUrl;
        const welcomeUploadedRecording = form.getFieldValue('video');
            if(welcomeVideoData?.file) {
                const videoUrl = await uploadToS3(welcomeVideoData?.file);
                companyHeaderData = {
                    ...companyHeaderData,
                    welcomeVideoUrl: videoUrl
                }
            }

            if(typeof welcomeVideoData === 'string') {
                companyHeaderData = {
                    ...companyHeaderData,
                    welcomeVideoUrl: welcomeVideoData
                }
                console.log("shit it's a string");
            }

            if(welcomeUploadedRecording) {
                companyHeaderData = {
                    ...companyHeaderData,
                    welcomeVideoUrl: welcomeUploadedRecording
                }
            }

            formData['Company Info'] = companyHeaderData;

            setFileLoading(false);

            let allData = {
                name: formData['Company Info'].name,
                description: formData['Company Info'].description,
                videoLink: formData['Company Info'].welcomeVideoUrl,
                header: formData['Company Info'].header,
                recruiterId: user?.recruiter?.id
            }

            console.log("DATA TO SEND: ", allData);

            createBranding.mutate(allData);
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
               <h1 className="text-2xl font-bold">Company Portal</h1>
               <div className='flex gap-3'>
                    <Button
                        type="default"
                        icon={<DownloadCloud className="w-4 h-4" />}
                    >
                        Export Data
                    </Button>
                    <Button
                        type="primary"
                        icon={<Plus className="w-4 h-4" />}

                    >
                        Create Portal
                    </Button>
                </div>
            </div>

            <div className={'w-full flex items-center flex-col justify-center'}>
                {portalLoading && <LoadingSpinner />}
                {/* {portalError && <Alert type={'error'} message={"Failed to load portals"} />} */}
            </div>
            {/* {portalList && <Portals data={portalList} />} */}
            <Portals data={portalList} />

            {/*<Card>*/}
            {/*    <Form*/}
            {/*        form={form}*/}
            {/*        layout="vertical"*/}
            {/*        onFinish={handlePortalSubmit}*/}
            {/*    >*/}
            {/*        <Steps current={current} items={items}/>*/}

            {/*        <div className="mt-4">{steps[current].content}</div>*/}

            {/*        <div className={'flex justify-end'} style={{marginTop: 24}}>*/}
            {/*            {current < steps.length - 1 && (*/}
            {/*                <Button type="primary" onClick={() => next()}>*/}
            {/*                    Next*/}
            {/*                </Button>*/}
            {/*            )}*/}
            {/*            {current === steps.length - 1 && (*/}
            {/*                <Button*/}
            {/*                    disabled={!submitEnabled}*/}
            {/*                    type="primary"*/}
            {/*                    htmlType="submit"*/}
            {/*                    loading={createBranding.isPending}*/}
            {/*                    icon={<PlusOutlined/>}*/}
            {/*                >*/}
            {/*                    Create Portal*/}
            {/*                </Button>*/}
            {/*            )}*/}
            {/*            {current > 0 && (*/}
            {/*                <Button style={{margin: '0 8px'}} onClick={() => prev()}>*/}
            {/*                    Previous*/}
            {/*                </Button>*/}
            {/*            )}*/}
            {/*        </div>*/}

            {/*        <div className={'m-4 flex items-center justify-center'}>*/}
            {/*            {(createBranding.isPending || fileLoading) && <Spin/>}*/}
            {/*            {createBranding?.error && <Alert message={createBranding?.error?.message} type={"error"}/>}*/}
            {/*        </div>*/}

            {/*        /!*<Form.Item>*!/*/}
            {/*        /!*  <div className="flex justify-end gap-4 mt-4">*!/*/}
            {/*        /!*    <Button onClick={() => navigate('/jobs')}>Cancel</Button>*!/*/}

            {/*        /!*  </div>*!/*/}
            {/*        /!*</Form.Item>*!/*/}
            {/*    </Form>*/}
            {/*</Card>*/}
        </div>
    );
}

export default CompanyPortal;