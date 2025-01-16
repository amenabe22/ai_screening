import React from 'react';

export const MapDots = () => (
    <div className="absolute inset-0">
        <div className="grid grid-cols-[repeat(100,1fr)] gap-2">
            {[...Array(40)].map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    {[...Array(100)].map((_, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="w-1 h-1 rounded-full bg-gray-300/50"
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    </div>
);