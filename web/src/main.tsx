// import { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConfigProvider} from 'antd';
import {Router, RouterProvider} from 'react-router-dom';
import {routes} from './routes/index.tsx';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {GoogleOAuthProvider} from "@react-oauth/google";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
    throw new Error("Missing Google Client ID")
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1677ff',
                    },
                }}
            >
                <RouterProvider router={routes}/>
            </ConfigProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </GoogleOAuthProvider>
    // </StrictMode>
);
