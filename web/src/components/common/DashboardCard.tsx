import React from "react";

export const DashboardCard = ({ title, content }: { title: string, content: string }) => {
    return (
        <div className="bg-[#E4E7EC] p-4 py-6 shadow-md">
            <h2 className="text-sm font-normal mb-2">{title}</h2>
            <p className="font-bold text-2xl">{content}</p>
        </div>
    );
};