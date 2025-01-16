import React, {useState} from 'react';
import {Button, Progress} from "antd";
import {countries} from "country-flag-icons";
import CountryList from "country-list-with-dial-code-and-flag";
import CountryFlagSvg from "country-list-with-dial-code-and-flag/dist/flag-svg";
import {ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from 'react-simple-maps'
import {Tooltip} from 'react-tooltip'
import WorldMap from "../maps/WorldMap.tsx";

const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"


interface City {
    name: string;
    coordinates: [number, number];
}

const cities: City[] = [
    {name: "New York", coordinates: [-74.006, 40.7128]},
    {name: "London", coordinates: [-0.1276, 51.5074]},
    {name: "Tokyo", coordinates: [139.6917, 35.6895]},
    {name: "Sydney", coordinates: [151.2093, -33.8688]},
    {name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068]},
]


export const ReportTabItem = ({onSelect, index, title, current}: {
    current: number,
    onSelect: any,
    index: number,
    title: string
}) => {
    return (
        <div onClick={() => onSelect(index)}
             className={`cursor-pointer px-4 py-1 ${index === current && 'bg-[#F4F8FF] text-blue-600'} rounded-lg`}>
            {title}
        </div>
    )
}
export default function RegionalTalentReport() {
    const [selected, setSelected] = useState(0);
    const [content, setContent] = useState("");

    return (
        <div className={'w-full my-8 border p-4'}>
            <div className={'flex items-center justify-between w-full my-4'}>
                <p className={'text-lg font-semibold'}>Talent Regional Traffic</p>
                <Button type={"default"}>Realtime Report</Button>
            </div>
            <div className={'report-types my-4 mx-4 flex items-center justify-start gap-3'}>
                <ReportTabItem current={selected} onSelect={setSelected} index={0} title={'Active'}/>
                <ReportTabItem current={selected} onSelect={setSelected} index={1} title={'Qualified'}/>
                <ReportTabItem current={selected} onSelect={setSelected} index={2} title={'Unqualified'}/>
                <ReportTabItem current={selected} onSelect={setSelected} index={3} title={'Accepted'}/>
                <ReportTabItem current={selected} onSelect={setSelected} index={4} title={'Rejected'}/>
            </div>
            <div className={'flex gap-4 items-start flex-col p-4'}>
                <div className={'grid grid-cols-4 mb-4 gap-4'}>
                    {CountryList?.getAll().slice(0, 5).map((item) => (
                        <div className={'flex items-center gap-3'}>
                            <div className={'h-10 object-cover w-10 rounded-full flex items-center justify-center'}
                                 dangerouslySetInnerHTML={{__html: CountryFlagSvg[item.code]}}>

                            </div>
                            <div className={'flex flex-col basis-3/4'}>
                                <p>{item.name}</p>
                                <Progress percent={30}/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={'w-full'}>
                    <WorldMap/>
                </div>

            </div>
        </div>

    );
}