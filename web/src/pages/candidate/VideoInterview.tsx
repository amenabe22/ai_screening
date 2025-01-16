import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Steps, Button, message } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import VideoRecorder from '../../components/candidate/VideoRecorder';
import { JobPosting, Question } from '../../types';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';


const uploadToS3 = async (file: any) => {
  console.log("FILE: ", file);
  const fileName = "Video-Interview" + Math.floor(Math.random() * 1000) + ".webm";

  const { data } = await api.post('/jobs/s3-presigned/?filename=' + fileName, {
    filename: fileName
  })


  const presignedUrl = data.url;

  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': 'application/octet-stream'
    },
  });
  return `https://aiscreening.s3.eu-north-1.amazonaws.com/${fileName}`;

};


function VideoInterview() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const applicationId = searchParams.get('applicationId');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: job } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data as JobPosting;
    },
  });

  const uploadFile = async (options: any) => {
    setIsLoading(true);
    const fileResponse = await uploadToS3(options);

    try {
      if (fileResponse) {
        const data = {
          question_id: currentQuestion?.id,
          application_id: applicationId,
          video_url: fileResponse
        }

        setIsLoading(false)
        submitVideo.mutate(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading file:', error);
    }
  };

  const submitVideo = useMutation({
    mutationFn: async (data: any) => {
      return await api.post(`/video-responses`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (data) => {
      if (currentStep < (job?.questions?.length || 0) - 1) {
        setCurrentStep(current => current + 1);
      } else {
        // message.success('Thank you for applying. We will get back to you soon');
        navigate('/candidate/status');
      }
    },
  });

  if (!job?.questions) return null;

  const currentQuestion = job.questions[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={'py-6 space-y-3'}>
        <h1 className="text-4xl text-center font-bold">Video Interview</h1>
      </div>

      {/*<Steps*/}
      {/*    current={currentStep}*/}
      {/*    items={job.questions.map((_, index) => ({*/}
      {/*      // title: `Question ${index + 1}`,*/}
      {/*    }))}*/}
      {/*/>*/}

      <Card className={'rounded-none'}>
        <div className="space-y-6">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Question {currentStep + 1}</h3>
            <p>{currentQuestion?.text}</p>
          </div>

          <VideoRecorder
            disabled={isLoading || submitVideo.isPending}
            onSubmit={(videoBlob) =>
              uploadFile(videoBlob)
            }

          />

          {(isLoading || submitVideo.isPending) && <LoadingSpinner />}
          {!isLoading && !submitVideo.isPending && submitVideo.isError && (
            <div className="text-red-500">Error submitting video</div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default VideoInterview;