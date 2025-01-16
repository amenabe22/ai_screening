import React from 'react';
import {Marker} from 'react-simple-maps';
import {Location} from './types';
import {LocationTooltip} from './LocationTooltip';

interface LocationMarkerProps {
    location: Location;
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
    location,
    isActive,
    onMouseEnter,
    onMouseLeave
}) => (
    <Marker
        coordinates={[location.coordinates[0], location.coordinates[1]]}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <g>
            <circle
                r={4}
                fill="#3B82F6"
                stroke="#fff"
                strokeWidth={2}
                className="cursor-pointer"
            />
            {isActive && <LocationTooltip location={location}/>}
        </g>
    </Marker>
);