import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

function Application() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: candidateList } = useQuery<Candidate[], any>({
    queryKey: ['candidates'],
    queryFn: async () => {
      return (await api.get('/candidates')).data;
    }
  });

  const uploadFile = async (options: any) => {
    setIsLoading(true);

    try {
      const fileResponse = await uploadToS3(options?.resume?.file);
      const candidateCheck = candidateList?.find(candidate => candidate.email === form.getFieldValue('email'));

      if (fileResponse) {
        setIsLoading(false)

        // if (candidateCheck) {
        //   console.log("CANDIDATE: ", candidateCheck);
        //   updateCandidate.mutate({
        //     id: candidateCheck.id,
        //     address: form.getFieldValue('address'),
        //     resumeUrl: fileResponse
        //   });
        //   return;
        // }
        const firstName = form.getFieldValue('firstName')
        const lastName = form.getFieldValue('lastName')
        createCandidate.mutate({
          name: `${firstName} ${lastName}`,
          email: form.getFieldValue('email'),
          phoneNumber: form.getFieldValue('phoneNumber'),
          address: form.getFieldValue('address'),
          resume: fileResponse
        });
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error uploading file:', error);
    }
  };

  const createCandidate = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post(`/candidates`, values, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response;
    },
    onSuccess: (data) => {
      createCandidateApplication.mutate({
        candidateId: data?.data?.id
      });
    },
    onError: (err) => {
      console.log('Failed to submit application', err);
      message.error('Failed to submit application');
    },
  });

  const updateCandidate = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.put(`/candidates/${values?.id}`, values, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response;
    },
    onSuccess: (data) => {
      createCandidateApplication.mutate({
        candidateId: data?.data?.id
      });
    },
    onError: (err) => {
      console.log('Failed to submit application', err);
      message.error('Failed to submit application');
    },
  });

  const createCandidateApplication = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post(`/applications`, {
        candidate_id: values?.candidateId,
        job_posting_id: id
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response;
    },
    onSuccess: (data) => {
      message.success('Application submitted successfully');
      navigate(`/candidate/jobs/${id}/instruction?applicationId=${data?.data?.id}`);
    },
    onError: (err) => {
      console.log('Failed to submit application', err);
      message.error('Failed to submit application');
    },
  });

  return (
    <div className="lg:w-2/3 mx-auto space-y-6 bg-white">
      <div className={'flex items-center justify-center w-full'}>
        <h2>AI Screening Platform Logo</h2>
        {/* <img className={'text-blue-800 w-40'} src={SpotteoLogo} alt="Spotteo Logo"/> */}
      </div>
      <div className={'p-6 border mt-3'}>
        <div className={'py-6 space-y-3'}>
          <h1 className="text-4xl text-center font-bold">Submit Application</h1>
          <p className={'text-center text-sm'}>Fill in the necessary details below to submit your application</p>
        </div>

        <Card className={'border-none'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={uploadFile}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone"
              rules={[
                { required: true, message: 'Please enter your phone' },
                { type: 'string', message: 'Please enter a valid phone' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="resume"
              label="Resume"
              rules={[{ required: true, message: 'Please upload your resume' }]}
            >
              <Upload
                name='file'
                maxCount={1}
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx"
              >
                <Button icon={<UploadOutlined />}>Upload Resume</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              {(createCandidate.isError || createCandidateApplication.isError) && (
                <p className="text-red-500">Failed to submit application. Please try again.</p>
              )}
              {(isLoading || createCandidate?.isPending || createCandidateApplication?.isPending) && <LoadingSpinner />}

              <div className="flex justify-end gap-4">
                <Button onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createCandidate.isPending}
                >
                  Continue to Video Interview
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>

    </div>
  );
}

export default Application;