import React from 'react';
import { Button, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from "react-router-dom";
import { DownloadCloud, Plus, Search } from 'lucide-react';
import { DatePicker } from 'antd';
import { IoFilterOutline } from "react-icons/io5";

const { RangePicker } = DatePicker;

export interface PortalDTO {
    id: string;
    name: string;
    description: string;
    header: string;
    videoLink: string;
    recruiter: Recruiter;
}

export interface Recruiter {
    id: number;
    name: string;
    email: string;
}

interface PortalTableProps {
    data: PortalDTO[];
}

const Portals: React.FC<PortalTableProps> = ({ data }) => {
    const baseUri = import.meta.env.VITE_BASE_URI;
    const columns: ColumnsType<PortalDTO> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: PortalDTO) => <Link target={'_blank'} to={`${baseUri}/portal/${record?.id}`} className="text-sm text-blue-600 font-medium">{text}</Link>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => (
                <span className="text-sm text-gray-600">{text}</span>
            ),
        },
        {
            title: 'Header',
            dataIndex: 'header',
            key: 'header',
            render: (text: string) => <span className="text-sm">{text}</span>,
        },
        {
            title: 'Video Link',
            dataIndex: 'videoLink',
            key: 'videoLink',
            render: (link: string) => (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Watch Video
                </a>
            ),
        },
        {
            title: 'Recruiter',
            dataIndex: 'recruiter',
            key: 'recruiter',
            render: (recruiter: Recruiter) => (
                <div>
                    <p className="font-medium">{recruiter.name}</p>
                    <p className="text-sm text-gray-500">{recruiter.email}</p>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full space-y-6 p-6 bg-white shadow-md border border-slate-200 rounded-md">
            <div className="flex justify-between rounded-lg items-center">
                <h1 className="text-xl font-semibold">Portal Listing</h1>
            </div>
            <div className='flex justify-between items-center'>
                <Input
                    placeholder="Search for names"
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    className="w-80"
                />
                <div className='flex gap-2 items-center'>
                    <RangePicker className='h-12 rounded-none' />
                    <Button type="default" icon={<IoFilterOutline className="w-4 h-4" />}>Filter</Button>
                </div>
            </div>
            <Table
                pagination={{ pageSize: 10 }}
                dataSource={data}
                columns={columns}
                rowKey="id"
                className="antd-table-custom"
            />
        </div>
    );
};

export default Portals;