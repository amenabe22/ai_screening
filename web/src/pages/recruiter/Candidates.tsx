import React, {useState, useEffect} from 'react';
import {Table, Input, Select, DatePicker, Tag, Space, Modal, Button} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {Candidate, mockCandidates} from '../../mocks/data.ts';
import {ColumnsType} from 'antd/es/table';
import CandidateDetail from "./CandidateDetail.tsx";
import {Plus, Search} from "lucide-react";
import {DashboardCard} from "./JobList.tsx";
import {useNavigate} from "react-router-dom";
import {IoFilterOutline} from "react-icons/io5";

const {Option} = Select;
const {RangePicker} = DatePicker;

const CandidatesList: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(mockCandidates);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [jobType, setJobType] = React.useState('active');
    const navigate = useNavigate();

    useEffect(() => {
        filterCandidates();
    }, [searchText, statusFilter, dateRange]);

    const filterCandidates = () => {
        let filtered = candidates.filter((candidate) => {
            const matchesSearch = candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
                candidate.position.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter.length === 0 || statusFilter.includes(candidate.status);
            const matchesDate = !dateRange || (candidate.applicationDate >= dateRange[0] && candidate.applicationDate <= dateRange[1]);
            return matchesSearch && matchesStatus && matchesDate;
        });
        setFilteredCandidates(filtered);
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: 'Applicant Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a onClick={() => handleCandidateClick(record)}>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status: string) => (
        //         <Tag color={status === 'Hired' ? 'green' : status === 'Rejected' ? 'red' : 'blue'}>
        //             {status}
        //         </Tag>
        //     ),
        // },
        {
            title: 'Job Fit',
            dataIndex: 'jobFit',
            key: 'jobFit',
            render: (jobFit) => (
                <Tag color={'blue'}>
                    {'80%'}
                </Tag>
            )
        },
        {
            title: 'Application Date',
            dataIndex: 'applicationDate',
            key: 'applicationDate',
        },
        {
            title: '',
            dataIndex: '',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <a className={'text-blue-600 text-sm'} >Accept</a>
                    <a className={'text-red-600 text-sm'} >Reject</a>
                </Space>
            )
        }
    ];

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleCandidateClick = (candidate: Candidate) => {
        console.log('Candidate clicked:', candidate);
        setCandidate(candidate);
        handleModalOpen();
    };

    return (
        <div className="space-y-6">
            <Modal
                okButtonProps={{style: {display: 'none'}}}
                cancelText={'Close'}
                open={isModalOpen}
                onClose={handleModalClose}
                onCancel={handleModalClose}
                width={1200}
                closeIcon={<span></span>}
            >
                {candidate && <CandidateDetail candidate={candidate}/>}
            </Modal>

            <div className="flex justify-between rounded-lg items-center">
                <h1 className="text-3xl font-bold">Candidate Poll</h1>
                <div className='flex gap-2 items-center'>
                    <RangePicker className='h-12 rounded-none'/>
                    <Button type="default" icon={<IoFilterOutline className="w-4 h-4"/>}>Filter</Button>
                </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
                <DashboardCard title='Total Applications' content='459'/>
                <DashboardCard title='Shortlisted' content='100'/>
                <DashboardCard title='Rejected' content='16'/>
            </div>
            <div className={'p-6 border border-slate-200 shadow-lg'}>
                <div className={'my-4 space-y-4'}>
                    <h1 className='text-xl font-semibold'>Applicants</h1>
                    <div className='flex justify-between items-center'>
                        <Input
                            placeholder="Search jobs"
                            prefix={<Search className="w-4 h-4 text-gray-400"/>}
                            className="w-80"
                        />
                        <div className='flex gap-2 items-center'>
                            <RangePicker className='h-12 rounded-none'/>
                            <Button type="default" icon={<IoFilterOutline className="w-4 h-4"/>}>Filter</Button>
                        </div>
                    </div>
                    <div className='flex'>
                        <p onClick={() => setJobType('active')}
                           className={`p-3 border ${jobType === 'active' ? 'bg-slate-200' : ''} cursor-pointer hover:bg-slate-100`}>
                            Active
                        </p>
                        <p onClick={() => setJobType('shortlisted')}
                           className={`p-3 border ${jobType === 'shortlisted' ? 'bg-slate-200' : ''} cursor-pointer hover:bg-slate-100`}>
                            Shortlisted Applicants
                        </p>
                        <p onClick={() => setJobType('rejected')}
                           className={`p-3 border ${jobType === 'rejected' ? 'bg-slate-200' : ''} cursor-pointer hover:bg-slate-100`}>
                            Rejected Applicants
                        </p>
                    </div>
                </div>
                <Table columns={columns} dataSource={filteredCandidates} rowKey="id"/>
            </div>
        </div>
    );
};

export default CandidatesList;

