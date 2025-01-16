import React from 'react';

export const WorldMapBackground: React.FC = () => (
    <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))' }}
    >
        <path
            d="M201.7 161.3l-3.4-0.7l-1.3 0.7l-2.3-1.5l0.3-1.4l-1.7 0.5l-1.1-1.1l-2.5 1.3l-0.3-2.1l-1.3,0.7l-1.7-0.5l-0.6-3.2l-1.5-1.9l1.5-1.2l-0.8-1.1l0.7-1.9l2.3-2.6l-0.7-1.1l1.7-2.4l-0.3-1.7l1.9-0.2l0.8-1.8l2.2-1.9l1.9,0.7l2.4-0.7l3.5,1.4l0.5,2.1l1.8,1.2l-0.2,2.7l2.1,1.9l-0.2,1.3l2.1,0.3l1.3,2.1l2.3,0.6l0.4,1.9l-0.9,2.1l0.3,2.4l-2.6-0.3l-1.5,0.7l-2.5-0.7l-1.8,1.2l-0.3,1.5z"
            className="fill-gray-200"
        />
        {/* Add more path elements for other continents */}
        <path
            d="M456.9 206.5l-0.5-2.3l1.8-2.4l2.4-0.4l2.1-2.1l2.6-0.1l3.1-2.9l1.8,0.8l2.6-0.4l0.3,2.7l-1.7,1.9l-0.2,2.3l-2.2,3.1l0.4,2.5l-2.6,0.4l-1.1,2.3l-2.9-0.1l-1.9-1.4l-2.1,0.7l-1.9-0.4l-0.6-2.3l1.1-2.2z"
            className="fill-gray-200"
        />
        <path
            d="M789.9 297.5l-1.5,2.1l-2.8-0.8l-2.4,1.1l-1.9-0.7l0.2-2.4l1.9-1.5l2.1,0.6l2.3-1.1l2.1,0.4l0,2.3z"
            className="fill-gray-200"
        />
        {/* Add more continents as needed */}
    </svg>
);