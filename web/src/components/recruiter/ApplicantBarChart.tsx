import React, {useState} from 'react';
import {LineChart, Bar, BarChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadialBarChart} from 'recharts';
import {Button} from "antd";


const data = [
    {"name": "Jan", "avg": 1900},
    {"name": "Feb", "avg": 1709},
    {"name": "Mar", "avg": 2265},
    {"name": "Apr", "avg": 1803},
    {"name": "May", "avg": 2065},
    {"name": "Jun", "avg": 1686},
    {"name": "Jul", "avg": 2335},
    {"name": "Aug", "avg": 2109},
    {"name": "Sep", "avg": 1523},
    {"name": "Oct", "avg": 2427},
    {"name": "Nov", "avg": 1604},
    {"name": "Dec", "avg": 2003}
]

export const ReportTabItem = ({onSelect, index, title, current}: {current: number, onSelect: any, index: number, title: string}) => {
    return (
        <div onClick={() => onSelect(index)} className={`cursor-pointer px-4 py-1 ${index === current && 'bg-[#F4F8FF] text-blue-600'} rounded-lg`}>
            {title}
        </div>
    )
}
export default function ApplicantBarChart() {
    const [selected, setSelected] = useState(0);

    return (
        <div className={'w-full my-8 border p-4'}>
            <div className={'flex items-center justify-between w-full my-4'}>
                <p className={'text-lg font-semibold'}>Average Applicants</p>
                <Button type={"default"}>View Report</Button>
            </div>
            <div className={'report-types my-4 mx-4 flex items-center justify-start gap-3'}>
                <ReportTabItem current={selected} onSelect={setSelected} index={0} title={'12 Months'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={1} title={'3 Months'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={2} title={'30 Days'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={3} title={'7 Days'} />
                <ReportTabItem current={selected} onSelect={setSelected} index={4} title={'24 Hours'} />
            </div>
            <BarChart
                className={'mx-4'}
                width={760}
                height={400}
                data={data}
            >
                <XAxis className={'border-none'} dataKey="name"/>
                {/*<YAxis/>*/}
                <Tooltip/>
                <Bar type="monotone" dataKey="avg" fill={"#7892dc"} stroke="#8884d8" />
            </BarChart>
        </div>

    );
}
