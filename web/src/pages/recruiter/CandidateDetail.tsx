import React from 'react';
import { Card, Descriptions, Tag, Button } from 'antd';
import { Candidate } from '../../mocks/data.ts';

interface CandidateDetailProps {
    candidate: Candidate;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate }) => {
    return (
        <div className="space-y-4">
            <Card>
                <div className={'font-semibold text-2xl py-3 pt-0 border-b mb-3'}>Candidate Details: <span className={'font-bold text-2xl'}>{candidate.name}</span></div>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Name">{candidate.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
                    <Descriptions.Item label="Position">{candidate.position}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={candidate.status === 'Hired' ? 'green' : candidate.status === 'Rejected' ? 'red' : 'blue'}>
                            {candidate.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Application Date">{candidate.applicationDate}</Descriptions.Item>
                    <Descriptions.Item label="Experience">{candidate.experience} years</Descriptions.Item>
                    <Descriptions.Item label="Skills">
                        {candidate.skills.map((skill, index) => (
                            <Tag key={index} color="blue">{skill}</Tag>
                        ))}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default CandidateDetail;
