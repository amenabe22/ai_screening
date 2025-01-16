import React, {useState} from 'react';
import {useParams, useSearchParams, useNavigate} from 'react-router-dom';
import {Card, Steps, Button, message} from 'antd';
import {useQuery, useMutation} from '@tanstack/react-query';
import api from '../../lib/axios';
import VideoRecorder from '../../components/candidate/VideoRecorder';
import {JobPosting, Question} from '../../types';
import axios from 'axios';
import {ApolloClient, gql, InMemoryCache} from '@apollo/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const client = new ApolloClient({
    uri: 'https://api.easyentryusa.com/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
        'content-type': 'application/json',
    },
});

const uploadToS3 = async (file: any) => {
    console.log("FILE: ", file);
    try {
        const fileName = "Video Interview" + Math.floor(Math.random() * 1000) + ".webm";

        const response = await client.mutate({
            mutation: gql`
      mutation MyMutation($name: String!, $type: String!) {
        generatePresignedUrl(arg1: { name: $name, type: $type }) {
          presignedUrl
        }
      }
    `,

            variables: {
                name: fileName,
                type: file.type,
            },
        });

        const presignedUrl = response.data.generatePresignedUrl.presignedUrl;

        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
                'x-amz-acl': 'public-read',
            },
        });

        return `https://easyentry.nyc3.digitaloceanspaces.com/${fileName}`;
    } catch (error) {
        throw error;
    }
};

function VideoRecorder() {
    const [isLoading, setIsLoading] = React.useState(false);

    const uploadFile = async (options: any) => {
        console.log("FILE: ", options);
        setIsLoading(true);
        const fileResponse = await uploadToS3(options);
    };

    return (
        <Card>
            <div className="space-y-6">
                <VideoRecorder
                    disabled={isLoading}
                    onSubmit={(videoBlob) =>
                        uploadFile(videoBlob)
                    }

                />

                {(isLoading) && <LoadingSpinner/>}
                {!isLoading && (
                    <div className="text-red-500">Error submitting video</div>
                )}
            </div>
        </Card>
    );
}

export default VideoRecorder;