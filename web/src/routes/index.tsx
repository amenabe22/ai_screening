import React from 'react';
import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom';

import RecruiterLayout from '../layouts/RecruiterLayout';
import CandidateLayout from '../layouts/CandidateLayout';

import RecruiterDashboard from '../pages/recruiter/Dashboard';
import JobList from '../pages/recruiter/JobList';
import CreateJob from '../pages/recruiter/CreateJob';
import JobDetail from '../pages/recruiter/JobDetail';
import ApplicationReview from '../pages/recruiter/ApplicationReview';

import Jobs from '../pages/candidate/Jobs';
import JobView from '../pages/candidate/JobView';
import Application from '../pages/candidate/Application';
import VideoInterview from '../pages/candidate/VideoInterview';
import PublicFunnel from '../pages/portal/PublicFunnel';

import Login from '../pages/auth/Login';
import RootLayout from '../RoutLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Signup from '../pages/auth/Signup';
import { NotFound } from '../pages/not-found/NotFound';
import CandidatesList from "../pages/recruiter/Candidates.tsx";
import CompanyPortal from "../pages/recruiter/CompanyPortal.tsx";
import ApplicationSuccess from "../pages/candidate/ApplicationSuccess.tsx";
import ForgotPassword from '../pages/auth/ForgotPassword.tsx';
import SetupPassword from '../pages/auth/SetupPassword.tsx';
import { ConfirmEmail } from "../pages/auth/ConfirmEmail.tsx";
import { useUser } from "../store/authStore.ts";
import InterviewInstruction from "../pages/candidate/InterviewInstruction.tsx";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  console.log("USER: ", isSignedIn);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>;
  }

  if ((!isSignedIn || !user)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const ProtectedLoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  } else {
    return <>{children}</>;
  }
}

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element:
          // <ProtectedRoute>
          <RecruiterLayout />
        // </ProtectedRoute>
        ,
        children: [
          // {
          //   path: '/dashboard',
          //   element: <RecruiterDashboard />,
          // },
          {
            path: '/jobs',
            element: <JobList />,
          },
          {
            path: "/company-portal",
            element: <CompanyPortal />
          },
          {
            path: '/jobs/create',
            element: <CreateJob />,
          },
          {
            path: '/jobs/:id',
            element: <JobDetail />,
          },
          {
            path: '/applications/:id',
            element: <ApplicationReview />,
          },
          {
            path: '/candidates',
            element: <CandidatesList />
          }
        ],
      },
      {
        path: '/candidate',
        element: (
          <CandidateLayout />
        ),
        children: [{
          path: '/candidate',
          element: <Jobs />,
        }, {
          path: '/candidate/jobs/:id',
          element: <JobView />,
        }, {
          path: '/candidate/jobs/:id/apply',
          element: <Application />,
        }, {
          path: '/candidate/jobs/:id/instruction',
          element: <InterviewInstruction />
        },
        {
          path: '/candidate/jobs/:id/:cid/interview',
          element: <VideoInterview />
        },
        {
          path: '/candidate/status',
          element: <ApplicationSuccess />
        }
        ]
      },
      // {
      //   path: '/login',
      //   element: (
      //     <ProtectedLoginRoute>
      //       <Login />
      //     </ProtectedLoginRoute>
      //   ),
      // },
      // {
      //   path: '/signup',
      //   element: (
      //     <ProtectedLoginRoute>
      //       <Signup />
      //     </ProtectedLoginRoute>
      //   ),
      // },
      // {
      //   path: '/forgot-password',
      //   element: (
      //     <ProtectedLoginRoute>
      //       <ForgotPassword />
      //     </ProtectedLoginRoute>
      //   ),
      // },
      // {
      //   path: '/reset-password/:token?',
      //   element: (
      //     <ProtectedLoginRoute>
      //       <SetupPassword />
      //     </ProtectedLoginRoute>
      //   ),
      // },
      // {
      //   path: '/confirm-email/:token?',
      //   element: <ProtectedLoginRoute><ConfirmEmail /></ProtectedLoginRoute>
      // },
      {
        path: '/*',
        element: <NotFound />
      },
      {
        path: "/portal/:id",
        element: <PublicFunnel />
      },

    ]
  },
])
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated) {
//     return (
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     );
//   }

//   return (
//     <Routes>
//       {user?.role === 'recruiter' ? (
//         <Route element={<RecruiterLayout />}>
//           <Route path="/" element={<RecruiterDashboard />} />
//           <Route path="/jobs" element={<JobList />} />
//           <Route path="/jobs/create" element={<CreateJob />} />
//           <Route path="/jobs/:id" element={<JobDetail />} />
//           <Route path="/applications/:id" element={<ApplicationReview />} />
//         </Route>
//       ) : (
//         <Route element={<CandidateLayout />}>
//           <Route path="/" element={<Jobs />} />
//           <Route path="/jobs/:id" element={<JobView />} />
//           <Route path="/jobs/:id/apply" element={<Application />} />
//           <Route path="/jobs/:id/interview" element={<VideoInterview />} />
//         </Route>
//       )}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default AppRoutes;