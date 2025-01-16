import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Card, Button, Descriptions, Tag, Divider, Typography} from 'antd';
import {Form, Input, message, Select, Space, Checkbox} from 'antd';
import {useQuery} from '@tanstack/react-query';
import {ArrowRightOutlined} from '@ant-design/icons';
import api from '../../lib/axios';
import {JobPosting} from '../../types';
import {ChevronLeftCircle} from 'lucide-react';
import ReactPlayer from "react-player";

const {Title, Paragraph, Text} = Typography;

function JobView() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {data: job} = useQuery({
        queryKey: ['job', id],
        queryFn: async () => {
            const {data} = await api.get(`/jobs/${id}`);
            return data as JobPosting;
        },
    });

    if (!job) return null;

    console.log("JOB: ", job);

    // Hardcoded data for additional details
    const companyName = 'Tech Solutions Inc.';
    const companyLocation = 'New York, USA';
    const benefits = ['Health Insurance', 'Paid Time Off', 'Remote Work Opportunities'];
    const aboutCompany =
        'Tech Solutions Inc. is a leading software development firm specializing in cutting-edge solutions for global clients. We foster innovation, collaboration, and professional growth.';

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            {/*<Card style={{*/}
            {/*    borderLeft: `14px solid ${job?.brand?.secondaryColor}`*/}
            {/*}}>*/}
            {/*<div className="flex justify-between items-center">*/}
            {/*    <div className='flex gap-2 items-center'>*/}
            {/*        <ChevronLeftCircle className='cursor-pointer' onClick={() => navigate(-1)}/>*/}
            {/*        <Title className='mt-2 p-0' level={3}>{job.title}</Title>*/}
            {/*    </div>*/}
            {/*    <Button*/}
            {/*        type="primary"*/}
            {/*        icon={<ArrowRightOutlined/>}*/}
            {/*        onClick={() => navigate(`/candidate/jobs/${id}/apply`)}*/}
            {/*    >*/}
            {/*        Apply Now*/}
            {/*    </Button>*/}
            {/*</div>*/}
            {/*<div className={'flex items-center'}>*/}
            {/*    <div style={{*/}
            {/*        background: `${job?.brand?.primaryColor}`,*/}
            {/*        padding: '2px',*/}
            {/*        width: '18px',*/}
            {/*        height: '18px',*/}
            {/*        borderRadius: '50%'*/}
            {/*    }}>*/}

            {/*    </div>*/}
            {/*    <div style={{*/}
            {/*        background: `${job?.brand?.secondaryColor}`,*/}
            {/*        padding: '2px',*/}
            {/*        width: '18px',*/}
            {/*        height: '18px',*/}
            {/*        borderRadius: '50%'*/}
            {/*    }}>*/}
            {/*</div>*/}

            {/*</div>*/}
            {/*</Card>*/}

            {/* Job Details Section */}

            <Card className={'bg-gray-50'}>
                <Descriptions title="Job Details" bordered column={1}>
                    <Descriptions.Item label="Job Title">{job.title}</Descriptions.Item>
                </Descriptions>

            </Card>

            <Card title="Description" className="bg-gray-50">
                <Paragraph>{job?.description}</Paragraph>

                <Button
                    className={'mt-4'}
                    type="primary"
                    icon={<ArrowRightOutlined/>}
                    onClick={() => navigate(`/candidate/jobs/${id}/apply`)}
                >
                    Apply Now
                </Button>
            </Card>


            <Divider/>
            <div className="text-center">
                {/* <Text type="secondary">Powered by Hoski.</Text> */}
            </div>
        </div>
    );
}

export default JobView;
