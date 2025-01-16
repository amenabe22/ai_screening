import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import Login from './pages/auth/Login';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useUser} from './store/authStore';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
}

// export const AuthRedirectWrapper = ({ children }: { children: React.ReactNode }) => {
//     const { user } = useUser();
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     useEffect(() => {
//         if (location.pathname === '/' && user) {
//             const role = user?.unsafeMetadata?.role;
//
//             if (role === 'recruiter') {
//                 console.log('recruiter');
//                 navigate('/dashboard', { replace: true });
//             } else {
//                 navigate('/candidate', { replace: true });
//             }
//         }
//     }, [user, location, navigate]);
//
//     return <>{children}</>;
// };

export default function RootLayout() {
    return (
        <main>
            <Outlet/>
        </main>
    );
}