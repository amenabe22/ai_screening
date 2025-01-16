import React, { useState } from 'react';
import { Card, List, Button, Tag, Typography, Space, Input, DatePicker, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../lib/axios';
import { JobPosting } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

function Jobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data as JobPosting[];
    },
  });

  jobs && console.log("jobs: ", jobs);

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!dateRange[0] || dayjs(new Date().getTime()).isAfter(dayjs(dateRange[0]))) &&
      (!dateRange[1] || dayjs(new Date().getTime()).isBefore(dayjs(dateRange[1])));
    return matchesSearch && matchesDate;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h2 className="text-left text-xl font-semibold">
        Available Positions
      </h2>

      <div className="mb-4 flex gap-3 items-center">
        <div className='basis-3/4 space-y-2'>
          <p>Search for jobs</p>
          <Input
          className='min-h-12'
            placeholder="Search job titles..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>

        <div className='space-y-2'>
          <p>Filter by date</p>
          <RangePicker
            className='min-h-12'
            style={{ width: '100%' }}
            onChange={(dates, dateStrings) =>
              setDateRange([dateStrings[0] || null, dateStrings[1] || null])
            }
          />
        </div>
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredJobs}
        loading={isLoading}
        renderItem={(job: JobPosting, index) => (
          <List.Item>
            <Card hoverable>
              <div className="flex justify-between items-start">
                <Space direction="vertical">
                  <Title level={4} className="mb-0">
                    {job.title}
                  </Title>
                  <div className={'flex items-center gap-3 mb-3'}>
                    <div className={`p`}>
                      <img className={'h-14 w-14 object-cover rounded-full'} src={job?.brand?.brandLogoUrl} alt={'Brand Logo'} />
                    </div>
                    <Text style={{
                      borderLeft: ``
                    }} type="secondary" className={`text-lg font-semibold`}>{job?.brand?.brandName}</Text>
                  </div>

                  <Paragraph ellipsis={{rows: 2}}>
                    {job.description}
                  </Paragraph>
                  <div className="flex gap-2 flex-wrap">
                    {job?.tags?.map((tag: string, tagIndex: number) => (
                      <Tag color="blue" key={tagIndex}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <Text type="secondary">
                    Posted on: {dayjs(new Date().getTime()).format('DD MMM, YYYY')}
                  </Text>
                </Space>
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Jobs;
