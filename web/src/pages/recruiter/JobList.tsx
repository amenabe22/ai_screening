import React from 'react';
import { Table, Button, Tag, Space, Input, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Search, CopyIcon } from 'lucide-react';
import api from '../../lib/axios';
import { JobPosting } from '../../types';
import { DatePicker } from 'antd';
import { IoFilterOutline } from "react-icons/io5";
import {useUser} from "../../store/authStore.ts";

const { RangePicker } = DatePicker;

export const DashboardCard = ({ title, content }: { title: string, content: string }) => {
  return (
    <div className="bg-[#E4E7EC] p-4 py-6 shadow-md">
      <h2 className="text-sm font-normal mb-2">{title}</h2>
      <p className="font-bold text-2xl">{content}</p>
    </div>
  );
};

function JobList() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [jobType, setJobType] = React.useState('active');
  // DEFAULT RECRUITER ID
  const recruiterId = 1

  const copyJobLink = (val: string) => {
    navigator.clipboard.writeText(val);
    message.success('Job link copied successfully');
  }

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get(`/jobs`);
      return data as JobPosting[];
    },
  });

  const columns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: JobPosting) => (
        <Link className='text-blue-600 font-semibold' to={`/jobs/${record.id}`} >{text}</Link>
      ),
    },
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
      render: (text: string) => <p>Remote</p>
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (text: string) => <Tag>{'Open'}</Tag>,
    // },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: () => "2024-10-10",
    },
    {
      title: 'Applicants',
      dataIndex: 'applicants',
      key: 'applicants',
      render: () => "40",
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: JobPosting) => (
        <Space>
          <Button
            type="text"
            icon={<Eye className="w-6 h-6 cursor-pointer" />}
            onClick={() => navigate(`/jobs/${record.id}`)}
          />
          <CopyIcon className="w-5 h-5 cursor-pointer" onClick={() => copyJobLink(import.meta.env.VITE_BASE_URI + "/candidate/jobs/" + record?.id)} />
          {/* <Button
            type="text"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => navigate(`/jobs/${record.id}/edit`)}
          /> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white space-y-6">
      <div className="flex justify-between rounded-lg items-center">
        <h1 className="text-2xl font-bold">Job Listing</h1>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/jobs/create')}
        >
          Create Job
        </Button>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <DashboardCard title='Active Jobs' content='200' />
        <DashboardCard title='Total Applications' content='459' />
        <DashboardCard title='Shortlisted' content='100' />
        <DashboardCard title='Rejected' content='16' />
      </div>

      <div className='p-6 shadow-lg space-y-4 border border-slate-200'>
        <h1 className='text-xl font-semibold'>Job Posting</h1>
        <div className='flex justify-between items-center'>
          <Input
            placeholder="Search jobs"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            className="w-80"
          />
          <div className='flex gap-2 items-center'>
            {/* <RangePicker className='h-12 rounded-none' /> */}
            <Button type="default" icon={<IoFilterOutline className="w-4 h-4" />}>Filter</Button>
          </div>
        </div>
        {/* <div className='flex'>
          <p onClick={() => setJobType('active')} className={`p-3 border ${jobType === 'active' ? 'bg-slate-200' : ''} cursor-pointer hover:bg-slate-100`}>
            Active Jobs
          </p>
          <p onClick={() => setJobType('closed')} className={`p-3 border ${jobType === 'closed' ? 'bg-slate-200' : ''} cursor-pointer hover:bg-slate-100`}>
            Closed Jobs
          </p>
        </div> */}
        <Table
          columns={columns}
          dataSource={jobs}
          loading={isLoading}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default JobList;