import React, { useState } from 'react';
import { Location } from './types';
import { locations } from './data';
import { MapContainer } from './MapContainer';
import { BaseMap } from './BaseMap';
import { LocationMarker } from './LocationMarker';

const WorldMap: React.FC = () => {
    const [activeLocation, setActiveLocation] = useState<Location | null>(null);

    return (
        <MapContainer>
            <BaseMap>
                {locations.map((location) => (
                    <LocationMarker
                        key={location.id}
                        location={location}
                        isActive={activeLocation?.id === location.id}
                        onMouseEnter={() => setActiveLocation(location)}
                        onMouseLeave={() => setActiveLocation(null)}
                    />
                ))}
            </BaseMap>
        </MapContainer>
    );
};

export default WorldMap;