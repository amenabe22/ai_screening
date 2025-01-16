import React from "react";
import { Button, Result } from "antd";

const ApplicationSuccess: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <Result
                    status="success"
                    title="Application Submitted Successfully!"
                    subTitle="Thank you for applying! We’ll review your application and contact you soon."
                    extra={[
                        // <Button
                        //     key="home"
                        //     type="primary"
                        //     className="bg-blue-500 hover:bg-blue-600 border-none"
                        //     onClick={() => console.log("Redirect to home")}
                        // >
                        //     Back to Home
                        // </Button>,
                        // <Button
                        //     key="view"
                        //     type="default"
                        //     onClick={() => console.log("View application status")}
                        // >
                        //     View Application Status
                        // </Button>,
                    ]}
                />
            </div>
        </div>
    );
};

export default ApplicationSuccess;