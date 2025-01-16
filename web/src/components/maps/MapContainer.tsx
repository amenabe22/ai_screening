import React from 'react';

interface MapContainerProps {
    children: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children }) => (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="relative aspect-[2/1]">
            {children}
        </div>
    </div>
);