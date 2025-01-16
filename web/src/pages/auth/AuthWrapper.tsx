import React, {useState} from 'react';
import {CustomCarousel} from '../../components/common/CustomCarousel.tsx';
import {Slide, SlideContent} from '../../types/index.ts';
import leftImage from '../../assets/images/left-image.png'
import signupImage from '../../assets/images/signup-image.png'
import {Rate} from 'antd';
import {ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle} from 'lucide-react';
import {GoogleOAuthProvider} from "@react-oauth/google";

export const NavigateCarousel = ({next, prev}: { next: () => void, prev: () => void }) => {
    return (
        <div className='space-y-4'>
            <Rate value={3} count={5} allowHalf className='text-white'/>
            <div className='flex gap-2 items-center'>
                <ArrowLeft onClick={prev}
                           className='w-10 cursor-pointer hover:bg-slate-200 transition-all duration-300 h-10 p-2 border-2 text-white rounded-full'/>
                <ArrowRight onClick={next}
                            className='w-10 cursor-pointer hover:bg-slate-200 transition-all duration-300 h-10 p-2 border-2 text-white rounded-full'/>
            </div>
        </div>
    )
}

export const SlideItemFirst = ({next, prev}: { next: () => void, prev: () => void }) => {
    return (
        <div
            className='mt-auto mx-4 mb-6 p-4 space-y-7 py-6 bottom-6 left-4 right-4 bg-[#006BFF4D]/40 backdrop-blur-sm min-h-40'>
            <h1 className='text-3xl text-left font-normal text-white'>
                “We’ve been using Spotteo to recruit and can’t imagine working without it.”
            </h1>

            <div className='flex gap-2 items-center justify-between'>
                <div className='space-y-2'>
                    <h1 className='text-3xl text-left font-semibold text-white'>Olivia Rhye</h1>
                    <p className='text-white font-normal text-sm text-left'>Lead Designer, Layers</p>
                    <p className='text-white font-normal text-sm text-left'>Web Development Agency</p>
                </div>
                <NavigateCarousel next={next} prev={prev}/>
            </div>
        </div>
    )
}

export const SlideItemSecond = ({next, prev}: { next: () => void, prev: () => void }) => {
    return (
        <div
            className='mt-auto mx-4 mb-6 space-y-7 p-4 py-6 bottom-6 left-4 right-4 bg-[#006BFF4D]/40 backdrop-blur-sm min-h-40'>
            <h1 className='text-3xl text-left font-normal text-white'>
                “We’ve been using Spotteo to recruit and can’t imagine working without it.”
            </h1>

            <div className='flex gap-2 items-center justify-between'>
                <div className='space-y-2'>
                    <h1 className='text-3xl text-left font-semibold text-white'>Andy Lane</h1>
                    <p className='text-white font-normal text-sm text-left'>Founder, Catalog</p>
                    <p className='text-white font-normal text-sm text-left'>Web Design Agency</p>
                </div>
                <NavigateCarousel next={next} prev={prev}/>
            </div>
        </div>
    )
}

export const AuthWrapper = ({children}: { children: React.ReactNode }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const prev = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slideContents.length);
    };

    const next = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slideContents.length - 1 : prevIndex - 1
        );
    };

    const slideContents: Slide[] = [
        {
            id: 1,
            content: <SlideItemFirst prev={prev} next={next}/>,
            background: leftImage
        },
        {
            id: 2,
            content: <SlideItemSecond prev={prev} next={next}/>,
            background: signupImage
        }
    ]

    return (
        <div className="w-full flex h-screen">
            <div className="component-holder lg:basis-1/2 w-full">{children}</div>
            <div className="basis-1/2 h-screen hidden lg:block">
                <CustomCarousel currentIndex={currentIndex} contents={slideContents}/>
            </div>
        </div>
    );
};