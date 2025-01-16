import React, {useState} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Button} from "antd";

const data = [
    {
        name: 'Jan',
        ['Declined Offer']: 2000,
        ['Accepted Offer']: 2400,
    },
    {
        name: 'Feb',
        ['Declined Offer']: 2400,
        ['Accepted Offer']: 1398,
    },
    {
        name: 'Mar',
        ['Declined Offer']: 2000,
        ['Accepted Offer']: 4800,
    },
    {
        name: 'Apr',
        ['Declined Offer']: 2780,
        ['Accepted Offer']: 3908,
    },
    {
        name: 'May',
        ['Declined Offer']: 1890,
        ['Accepted Offer']: 4800,
    },
    {
        name: 'Jun',
        ['Declined Offer']: 2390,
        ['Accepted Offer']: 3800,
    },
    {
        name: 'Jul',
        ['Declined Offer']: 3490,
        ['Accepted Offer']: 4300,
    },
    {
        name: 'Aug',
        ['Declined Offer']: 3490,
        ['Accepted Offer']: 4300,
    },
    {
        name: 'Sep',
        ['Declined Offer']: 3490,
        ['Accepted Offer']: 4300,
    },
    {
        name: 'Oct',
        ['Declined Offer']: 3490,
        ['Accepted Offer']: 2300,
    },
    {
        name: 'Nov',
        ['Declined Offer']: 3490,
        ['Accepted Offer']: 4000,
    },
    {
        name: 'Dec',
        ['Declined Offer']: 2490,
        ['Accepted Offer']: 4900,
    },
];

export const ReportTabItem = ({onSelect, index, title, current}: {current: number, onSelect: any, index: number, title: string}) => {
    return (
        <div onClick={() => onSelect(index)} className={`cursor-pointer px-4 py-1 ${index === current && 'bg-[#F4F8FF] text-blue-600'} rounded-lg`}>
            {title}
        </div>
    )
}
export default function ReportChart() {
    const [selected, setSelected] = useState(0);

    return (
        <div className={'w-full my-8 border p-4'}>
            <div className={'flex items-center justify-between w-full my-4'}>
                <p className={'text-lg font-semibold'}>Performance Index</p>
                <Button type={"default"}>View Report</Button>
            </div>
            <div className={'report-types my-4 mx-4 flex items-center justify-start gap-3'}>
                <ReportTabItem current={selected} onSelect={setSelected} index={0} title={'12 Months'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={1} title={'3 Months'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={2} title={'30 Days'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={3} title={'7 Days'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={4} title={'24 Hours'} />
            </div>
            <LineChart
                className={'mx-4'}
                width={760}
                height={400}
                data={data}
            >
                <XAxis className={'border-none'} dataKey="name"/>
                {/*<YAxis/>*/}
                <Tooltip/>
                <Line type="monotone" dataKey="Declined Offer" stroke="#8884d8" activeDot={{r: 8}}/>
                <Line type="monotone" dataKey="Accepted Offer" stroke="#82ca9d"/>
            </LineChart>
        </div>

    );
}
