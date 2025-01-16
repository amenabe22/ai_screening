// import React from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ConfigProvider } from 'antd';
// import AppRoutes from './routes';
// import { useAuthStore } from './store/authStore';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//       retry: 1,
//     },
//   },
// });

// function App() {
//   const { isAuthenticated } = useAuthStore();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ConfigProvider
//         theme={{
//           token: {
//             colorPrimary: '#1677ff',
//           },
//         }}
//       >
//         <Router>
//           <div className="min-h-screen bg-gray-50">
//             <AppRoutes />
//           </div>
//         </Router>
//       </ConfigProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

// export default App;