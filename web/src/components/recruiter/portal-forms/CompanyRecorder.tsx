import React, {useEffect, useRef, useState} from 'react';
import {Form, Input, Button, Upload, Card, Spin, message} from 'antd';
import {UploadOutlined} from "@ant-design/icons";
import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import VideoRecorder from "../../candidate/VideoRecorder.tsx";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import axios from "axios";


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

const CompanyRecorder: React.FC = ({form, toggleSubmit}: {form: any, toggleSubmit: any}) => {
        const [value, setValue] = useState(1);
        const ref = useRef<any>(null);
        const newRef = useRef<any>(null);
        const [isLoading, setIsLoading] = React.useState(false);
        const [videoUrlResponse, setResponse] = useState<any>(null)

        const uploadFile = async (options: any) => {
            console.log("FILE: ", options);
            setIsLoading(true);
            const fileResponse = await uploadToS3(options);

            setResponse(fileResponse);

            console.log("FILE RESPONSE: ", fileResponse);

            await form.setFieldValue('video', fileResponse);

            setIsLoading(false);
            toggleSubmit(true);
            message.success('Video Created Successfully!');
        };

        const onChange = (e: RadioChangeEvent) => {
            setValue(e.target.value);
        };

        useEffect(() => {
            toggleSubmit(false);
        }, []);

        return (
            <div className={'space-y-4 mt-4'}>
                <div className="mb-4 text-lg pb-2 border-b">Record Your Hiring Sales Letter</div>
                <div className="flex">
                    <div onClick={() => setValue(1)} className={`px-4 border py-2 ${ value === 1 ? 'bg-[#C1DBFF]' : 'bg-slate-50'} cursor-pointer`}>Record a Video</div>
                    <div onClick={() => setValue(2)} className={`px-4 border py-2 ${ value === 2 ? 'bg-[#C1DBFF]' : 'bg-slate-50'} cursor-pointer`}>Video File</div>
                    <div onClick={() => setValue(3)} className={`px-4 border py-2 ${ value === 13? 'bg-[#C1DBFF]' : 'bg-slate-50'} cursor-pointer`}>Youtube Link</div>
                </div>
                <div className="bg-white">
                    <Form.Item
                        className={'mb-0 space-y-3'}
                        name="welcomeVideoUrl"
                        // label="Welcome Video URL"
                        rules={[{required: false, message: 'Please enter the welcome video URL'}]}
                    >
                        {value === 3 && <Input onChange={() => toggleSubmit(true)} ref={ref} placeholder={"Video URL"}/>}
                        {value === 2 && <Upload
                            name='welcomeVideo'
                            maxCount={1}
                            onChange={() => toggleSubmit(true)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined/>}>Upload Welcome Video</Button>
                        </Upload>}

                    </Form.Item>

                    {value === 1 && <Card>
                        <div className="space-y-6 w-full">
                            <VideoRecorder
                                isRecruiter={true}
                                disabled={isLoading}
                                onSubmit={(videoBlob) =>
                                    uploadFile(videoBlob)
                                }
                            />

                            {(isLoading) && <div className={'w-full flex justify-center items-center'}>
                                <Spin/>
                            </div>}
                        </div>
                        <Form.Item
                            name="video"
                            rules={[{ required: false, message: "Please enter the welcome video URL" }]}
                        >
                            <Input
                                ref={newRef}
                                className={'hidden'}
                                defaultValue={"aaa"}
                                value={videoUrlResponse}
                                onChange={(e) => {
                                    setResponse(videoUrlResponse);
                                }}
                            />
                        </Form.Item>
                    </Card>}
                </div>
            </div>
        );
    }
;

export default CompanyRecorder;

