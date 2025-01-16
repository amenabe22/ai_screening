import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react'

const { Header, Content } = Layout;

function CandidateLayout() {
  return (
    <Layout className="min-h-screen bg-white">
      {/*<Header className="bg-white px-6 flex items-center justify-between">*/}
      {/*  <div className="flex items-center gap-4">*/}
      {/*    <SignedIn>*/}
      {/*      <UserButton />*/}
      {/*    </SignedIn>*/}
      {/*  </div>*/}
      {/*</Header>*/}
      <Content className="p-6">
        <Outlet />
      </Content>
    </Layout>
  );
}

export default CandidateLayout;