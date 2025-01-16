import React, { useState } from 'react';
import { SlideContent } from '../../types';


export const CustomCarousel: React.FC<SlideContent> = ({contents, currentIndex}) => {

    return (
        <div className="carousel-container w-full h-screen relative overflow-hidden">
            <div
                className="slides h-screen bg-slate-800 flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {contents?.map((slide) => (
                    <div
                        key={slide.id}
                        className="slide flex h-screen items-center justify-center text-white text-xl"
                        style={{
                            minWidth: '100%',
                            background: `url(${slide.background})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        {slide.content}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {/* <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                &#8592;
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                &#8594;
            </button> */}
        </div>
    );
};