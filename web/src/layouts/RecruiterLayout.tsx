import { Button, Layout, Menu, Modal } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Building2, BriefcaseIcon, Users, Globe, PlusIcon } from 'lucide-react';
import { MdOutlineAnalytics } from 'react-icons/md';
import { MdSpaceDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { IoExitOutline } from "react-icons/io5";
import { useUser } from "../store/authStore.ts";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

function RecruiterLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [open, setModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const logoutUser = () => {
        setConfirmLoading(true);
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        setConfirmLoading(false);
    }

    const menuItems = [

        {
            key: '/',
            icon: <MdSpaceDashboard className="w-4 h-4" />,
            label: 'Dashboard',
        },
        {
            key: '/jobs',
            icon: <BriefcaseIcon className="w-4 h-4" />,
            label: 'Job Listing',
        }
        // {
        //     key: '/candidates',
        //     icon: <Users className="w-4 h-4" />,
        //     label: 'Candidate Poll',
        // },
        // {
        //     key: '/company-portal',
        //     icon: <Globe className="w-4 h-4" />,
        //     label: 'Company Portal',
        // },
        // {
        //     key: '#',
        //     icon: <MdOutlineAnalytics className="w-4 h-4" />,
        //     label: 'Analytics and Reports',
        // },
    ];

    const bottomMenu = [

        {
            key: '#',
            icon: <BiSupport className="w-4 h-4" />,
            label: 'Support',
        },
        {
            key: '#',
            icon: <IoSettingsOutline className="w-4 h-4" />,
            label: 'Settings',
        }
    ];

    return (
        <Layout className="min-h-screen bg-[#006BFF]">
            <Modal
                title="Title"
                open={open}
                onOk={logoutUser}
                confirmLoading={confirmLoading}
                onCancel={() => setModalOpen(false)}
            >
                <p>{"Are you sure you want to logout"}</p>
            </Modal>

            <Layout>
                <Sider width={250} className="bg-[#006BFF] hidden text-white pt-4 space-x-3 flex flex-col justify-between h-[100vh]">
                    <div>
                        <div className="text-3xl font-bold p-4 rounded-full text-center">AI Screening</div>
                        <div className={'p-3'}>
                            <Button onClick={() => navigate('/jobs/create')} className={'w-full'} type={"primary"} icon={<PlusIcon />}>
                                Create Job
                            </Button>
                        </div>
                        <Menu
                            mode="inline"
                            theme={"dark"}
                            selectedKeys={[location.pathname]}
                            items={menuItems}
                            onClick={({ key }) => navigate(key)}
                            className=" bg-[#006BFF] border-r flex flex-col gap-2"
                        />
                    </div>

                    {/* <div className='flex flex-col absolute bottom-10 justify-end'>
                        <Menu
                            mode="inline"
                            theme={"dark"}
                            selectedKeys={[location.pathname]}
                            items={bottomMenu}
                            onClick={({ key }) => navigate(key)}
                            className="bg-[#006BFF] border-r flex flex-col gap-2"
                        />

                        <div className='avatar-container bg-[#006BFF] mt-4 p-3 gap-3 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <img className="w-10 h-10 rounded-full" src={'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt={user?.fullName} />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm'>{user?.user?.name}</p>
                                    <p className='text-xs'>{user?.user?.email}</p>
                                </div>
                            </div>

                            <div>
                                <IoExitOutline onClick={() => setModalOpen(true)} className='cursor-pointer hover:opacity-70 transition-all duration-300' fontSize={20} />
                            </div>
                        </div>
                    </div> */}
                </Sider>

                <Content className="h-screen overflow-auto bg-white flex justify-center">
                    {/*<Header className="bg-white p-6 h-20 flex items-center justify-between">*/}
                    {/*    <div className="text-xl font-bold py-3 border-b">Jobs</div>*/}
                    {/*    <div></div>*/}
                    {/*    <div className="ml-4 bg-gray-200 px-6 text-black rounded-md">*/}
                    {/*        <SignedIn>*/}
                    {/*            <div className={`flex items-center gap-3`}>*/}
                    {/*                <UserButton />*/}
                    {/*                <p>{user && user?.fullName}</p>*/}
                    {/*            </div>*/}
                    {/*        </SignedIn>*/}
                    {/*    </div>*/}
                    {/*</Header>*/}
                    <div className={'p-6  max-w-7xl w-full'}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default RecruiterLayout;