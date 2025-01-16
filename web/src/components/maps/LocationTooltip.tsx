import React from 'react';
import { Location } from './types';

interface LocationTooltipProps {
    location: Location;
}

export const LocationTooltip: React.FC<LocationTooltipProps> = ({ location }) => (
    <foreignObject
        x={10}
        y={-45}
        width={200}
        height={100}
        className="overflow-visible"
    >
        <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold">
          {location.city}, {location.country}
        </span>
            </div>
            <p className="text-sm text-gray-600">
                {location.applicants} Applicants
            </p>
        </div>
    </foreignObject>
);