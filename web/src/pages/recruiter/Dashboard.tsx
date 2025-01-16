import React, {useEffect, useState} from 'react';
import {Card, Row, Col, Statistic, Table, Tag, Input, DatePicker, Progress, Button} from 'antd';
import {
    BriefcaseIcon,
    Users,
    CheckCircle,
    XCircle,
    Search,
    DollarSign,
    Clock,
    TrendingUp,
    BarChart,
    DownloadCloud, Plus
} from 'lucide-react';
import {useUser} from '../../store/authStore';
import {IoFilterOutline} from "react-icons/io5";
import {DashboardCard} from "../../components/common/DashboardCard.tsx";
import ReportChart from "../../components/recruiter/ReportChart.tsx";
import {SearchOutlined} from "@ant-design/icons";
import ApplicantBarChart from "../../components/recruiter/ApplicantBarChart.tsx";
import RegionalTalentReport from "../../components/recruiter/RegionalTalentReport.tsx";

const {RangePicker} = DatePicker;

const mockReports = {
    activeJobs: 42,
    totalApplications: 156,
    shortlisted: 28,
    rejected: 14,
    averageSalary: 85000,
    timeToHire: 21,
    offerAcceptanceRate: 78,
    diversityRatio: 0.42,
};

const mockTopJobs = [
    {title: 'Senior React Developer', applications: 45, status: 'Active'},
    {title: 'Product Manager', applications: 32, status: 'Active'},
    {title: 'Data Scientist', applications: 28, status: 'Closed'},
];

const sampleReportData = [
    {department: 'Engineering', openPositions: 15, applicants: 120, createdOn: '2024-10-08'},
    {department: 'Marketing', openPositions: 7, applicants: 85, createdOn: '2024-10-08'},
    {department: 'Sales', openPositions: 10, applicants: 95, createdOn: '2024-10-08'},
    {department: 'HR', openPositions: 3, applicants: 40, createdOn: '2024-10-08'},
    {department: 'Finance', openPositions: 5, applicants: 60, createdOn: '2024-10-08'},
];

const AppliedAvatar = () => {
    return (<div className={'flex items-center gap-3'}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnE_fy9lLMRP5DLYLnGN0LRLzZOiEpMrU4g&s"
             alt="avatar" className="w-12 h-12 rounded-full"/>
        <div className={'flex flex-col gap-1'}>
            <p className={'font-semibold'}>John Doe</p>
            <p>Applied for <span className={'font-semibold text-[#006BFF]'}>Software Engineer</span></p>
        </div>
    </div>)
}

const RecruitmentCard = () => {
    return (
        <div className={'py-7 px-5 bg-white border flex items-center justify-between'}>
            <p className={'basis-2/3'}>Applications Received</p>
            <p>23</p>
        </div>
    )
}

export const JobTypeTabItem = ({title, index, value, setJobType}: {title: string, index: string, value: string, setJobType: any}) => {
    return (
        <p onClick={() => setJobType(index)}
           className={`p-3 border ${value === index && 'bg-slate-200'} cursor-pointer hover:bg-slate-100`}>
            {title}
        </p>
    )
}

function Dashboard() {
    const user = useUser();
    const [jobType, setJobType] = useState('active');

    useEffect(() => {
        console.log(jobType);
    }, [jobType]);

    const cards = [
        {
            title: 'Active Jobs',
            value: mockReports.activeJobs,
            icon: <BriefcaseIcon className="w-8 h-8 text-blue-500"/>,
        },
        {
            title: 'Total Applications',
            value: mockReports.totalApplications,
            icon: <Users className="w-8 h-8 text-green-500"/>,
        },
        {
            title: 'Shortlisted',
            value: mockReports.shortlisted,
            icon: <CheckCircle className="w-8 h-8 text-yellow-500"/>,
        },
        {
            title: 'Rejected',
            value: mockReports.rejected,
            icon: <XCircle className="w-8 h-8 text-red-500"/>,
        },
        {
            title: 'Average Salary',
            value: `$${mockReports.averageSalary.toLocaleString()}`,
            icon: <DollarSign className="w-8 h-8 text-purple-500"/>,
        },
        {
            title: 'Time to Hire',
            value: `${mockReports.timeToHire} days`,
            icon: <Clock className="w-8 h-8 text-indigo-500"/>,
        },
        {
            title: 'Offer Acceptance Rate',
            value: `${mockReports.offerAcceptanceRate}%`,
            icon: <TrendingUp className="w-8 h-8 text-teal-500"/>,
        },
        {
            title: 'Diversity Ratio',
            value: `${(mockReports.diversityRatio * 100).toFixed(1)}%`,
            icon: <Users className="w-8 h-8 text-pink-500"/>,
        },
    ];

    const columns = [
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Open Positions',
            dataIndex: 'openPositions',
            key: 'openPositions',
        },
        {
            title: 'Applicants',
            dataIndex: 'applicants',
            key: 'applicants',
        },
        {
            title: 'Created On',
            dataIndex: 'createdOn',
            key: 'createdOn',
        },
        {
            title: '',
            render: (text, record) => (
                <p className={'font-semibold text-blue-600 cursor-pointer'}>View</p>
            ),
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div className={'space-y-2'}>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p>Welcome back, {user?.user?.user?.name}</p>
                </div>
                <div className={'space-y-5'}>
                    <div className='flex gap-3'>
                        <Button
                            type="default"
                            icon={<DownloadCloud className="w-4 h-4"/>}
                        >
                            Export Data
                        </Button>
                        <Button
                            type="primary"
                            icon={<Plus className="w-4 h-4"/>}
                        >
                            Create Job
                        </Button>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <RangePicker className='h-12 rounded-none'/>
                    </div>
                </div>

            </div>

            <div className={'grid grid-cols-4 gap-4'}>
                <div className={'col-span-3'}>
                    <Row gutter={[16, 16]}>
                        {cards.map((card) => (
                            <Col xs={24} sm={12} lg={6} key={card.title}>
                                <DashboardCard title={card.title} content={card?.value?.toString()}/>
                            </Col>
                        ))}
                    </Row>

                    <ReportChart/>

                    <Card title="Recruitment Performance Report" className="mt-6">
                        <div className={'flex gap-3 items-center my-4'}>
                            <Input placeholder="Search" prefix={<SearchOutlined/>}/>
                            <RangePicker />
                            <Button type={"default"} icon={<IoFilterOutline />}>Filters</Button>
                        </div>
                        <div className={'status-selector flex items-center my-4'}>
                            <JobTypeTabItem value={jobType} title={'Active Jobs'} index={'active'} setJobType={setJobType} />
                            <JobTypeTabItem value={jobType} title={'Filled Position'} index={'filled'} setJobType={setJobType} />
                            <JobTypeTabItem value={jobType} title={'Open Position'} index={'open'} setJobType={setJobType} />
                        </div>

                        <Table rowSelection={{type: "checkbox"}} dataSource={sampleReportData} columns={columns} pagination={false}/>
                        <Button type={"default"} className={'float-end my-4 right-10'}>View All</Button>
                    </Card>

                    <ApplicantBarChart />

                    <RegionalTalentReport />

                    {/*<Row gutter={[16, 16]} className="mt-6">*/}
                    {/*    <Col xs={24} lg={12}>*/}
                    {/*        <Card title="Top Performing Jobs" extra={<a href="#">View All</a>}>*/}
                    {/*            <ul className="space-y-4">*/}
                    {/*                {mockTopJobs.map((job, index) => (*/}
                    {/*                    <li key={index} className="flex items-center justify-between">*/}
                    {/*                        <div>*/}
                    {/*                            <p className="font-semibold">{job.title}</p>*/}
                    {/*                            <p className="text-sm text-gray-500">{job.applications} applications</p>*/}
                    {/*                        </div>*/}
                    {/*                        <Tag color={job.status === 'Active' ? 'blue' : 'gray'}>{job.status}</Tag>*/}
                    {/*                    </li>*/}
                    {/*                ))}*/}
                    {/*            </ul>*/}
                    {/*        </Card>*/}
                    {/*    </Col>*/}
                    {/*    <Col xs={24} lg={12}>*/}
                    {/*        <Card title="Recruitment Funnel">*/}
                    {/*            <div className="space-y-4">*/}
                    {/*                <div className="flex justify-between items-center">*/}
                    {/*                    <span>Applications Received</span>*/}
                    {/*                    <span className="font-semibold">{mockReports.totalApplications}</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="flex justify-between items-center">*/}
                    {/*                    <span>Shortlisted</span>*/}
                    {/*                    <span className="font-semibold">{mockReports.shortlisted}</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="flex justify-between items-center">*/}
                    {/*                    <span>Interviews Conducted</span>*/}
                    {/*                    <span className="font-semibold">42</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="flex justify-between items-center">*/}
                    {/*                    <span>Offers Made</span>*/}
                    {/*                    <span className="font-semibold">18</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="flex justify-between items-center">*/}
                    {/*                    <span>Offers Accepted</span>*/}
                    {/*                    <span className="font-semibold">14</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </Card>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                </div>
                <div>
                    <div className={'p-2 flex flex-col gap-3'}>
                        <div className={'activity-header mb-3 flex justify-between items-center'}>
                            <h1 className={'font-semibold text-xl'}>Activity</h1>
                            <p className={'text-sm'}>View All</p>
                        </div>

                        <div className={'flex flex-col gap-5'}>
                            <AppliedAvatar/>
                            <AppliedAvatar/>
                            <AppliedAvatar/>
                            <AppliedAvatar/>
                            <AppliedAvatar/>
                        </div>

                        <div className={'activity-header mb-3 mt-5'}>
                            <h1 className={'font-semibold text-xl'}>Recruitment Report</h1>
                        </div>

                        <div className={'flex flex-col'}>
                            <RecruitmentCard/>
                            <RecruitmentCard/>
                            <RecruitmentCard/>
                            <RecruitmentCard/>
                            <RecruitmentCard/>
                            <RecruitmentCard/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

