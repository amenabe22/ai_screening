import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const BaseMap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ComposableMap
        projection="geoMercator"
        projectionConfig={{
            scale: 140,
            center: [0, 20]
        }}
    >
        <ZoomableGroup>
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#E5E7EB"
                            stroke="#D1D5DB"
                            strokeWidth={0.5}
                            style={{
                                border: "none",
                                default: { outline: 'none' },
                                hover: { fill: '#D1D5DB', outline: 'none' },
                                pressed: { outline: 'none' },
                            }}
                        />
                    ))
                }
            </Geographies>
            {children}
        </ZoomableGroup>
    </ComposableMap>
);