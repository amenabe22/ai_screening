import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { Spin, Alert, Typography, Button, Layout } from "antd";
import { Play } from "lucide-react";
import api from "../../lib/axios.ts";
import {useRef, useState} from "react";
import spotteoLogo from '../../assets/images/spotteo-svg.svg'
import VideoPlayer from "react-video-player-extended";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function PublicFunnel() {
    const { id } = useParams();
    const [playing, setPlaying] = useState(false);
    const videoPlayerRef = useRef(null)

    const baseUri = import.meta.env.VITE_BASE_URI;

    const { data: portal, isLoading, isError } = useQuery({
        queryKey: ["portal", id],
        queryFn: async () => {
            const { data } = await api.get(`/company-portal/${id}`);
            console.log(data);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Spin size="large" className="text-white" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Alert
                    message="Error loading portal"
                    type="error"
                    className="bg-gray-800 text-white border-red-500 p-4 rounded-lg shadow-lg"
                />
            </div>
        );
    }

    if (!portal) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Title level={2} className="text-white">
                    No portal found
                </Title>
            </div>
        );
    }

    portal && console.log("PORTAL: ", portal);

    return (
        <Layout className="min-h-screen w-full bg-gradient-to-b from-[#001533] to-[#004099]">
            <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-10">
                {/*<img className={'mb-14 mx-auto'} src={spotteoLogo} alt="Logo"/>*/}
                <header className="text-center mb-2">
                    <h1
                        style={{
                            color: "#FFFFFF",
                        }}
                        className="text-white  py-4 font-bold text-xl sm:text-2xl lg:text-6xl uppercase rounded"
                    >
                        {portal.name}
                    </h1>
                </header>

                <main className="text-center w-full">
                    <h1
                        style={{
                            color: "#FFFFFF",
                        }}
                        className="text-white mb-8 text-2xl sm:text-4xl lg:text-3xl font-normal leading-tight"
                    >
                        {portal.header}
                    </h1>

                    <Paragraph className="text-red-400 leading-5 mb-8 text-lg sm:text-2xl font-bold">
                        {portal?.description}
                    </Paragraph>

                    {portal.videoLink && (
                        <div style={{
                            backgroundImage: `url(${portal?.videoThumbnailLink || ''})`,
                            // backgroundSize: '',
                        }} className="mx-auto flex items-stretch justify-stretch w-fit mt-10 mb-4 rounded-xl overflow-hidden border border-red-400 shadow-2xl">
                            {/*<VideoPlayer url={portal?.videoLink} isPlaying={playing} volume={1} />*/}
                            <ReactPlayer
                                url={portal.videoLink}
                                // width="50rem"
                                ref={videoPlayerRef}
                                height="30rem"
                                light={true}
                                controls={true}
                                playing={playing}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                playIcon={
                                    <div className="flex items-center justify-center bg-opacity-50">
                                        <Play onClick={() => setPlaying(true)} className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                }
                            />
                        </div>
                    )}

                    <Button
                        type="primary"
                        size="large"
                        className="bg-red-600 mt-4 hover:bg-red-700 text-white text-lg sm:text-xl font-bold sm:py-4 sm:px-14 h-auto rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
                        onClick={() => {
                            window.location.href = `${baseUri}/candidate/jobs/${portal?.jobPosting?.id}/apply`;
                        }}
                    >
                        Get Started Now
                    </Button>

                    <div className="mt-16 text-gray-400 text-sm sm:text-base max-w-3xl mx-auto">
                        <Paragraph className="text-white leading-7">
                            {/*Join our team and be part of something extraordinary. We value your*/}
                            {/*skills and passion.*/}
                            <strong>Disclaimer:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
                        </Paragraph>
                    </div>
                </main>
            </Content>
        </Layout>
    );
}