import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer ,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { backendUrl } from './utils/allUrls';
import { useSelector } from 'react-redux';
import { HomeScreen , Login , Signup , NotFound} from './components';

function App() {
  // Simulating user authentication; replace this logic with your actual authentication check
  const isAuthenticated = useSelector((state) => state.User?.loggedInUser);

  useEffect(() => {
    const checkHeartbeat = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/heartbeat`);
        console.log(response.data.message);
      } catch (error) {
        console.error('Error checking heartbeat:', error);
      }
    };

    const interval = setInterval(checkHeartbeat, 2 * 60 * 1000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  // ProtectedRoute logic
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  // const ProtectedRoute = ({ children }) => {
  //   console.log("isAuthenticated:", isAuthenticated);
  //   if (!isAuthenticated) {
  //     toast.error('please log in first');
  //     console.log("No logged-in user, you cannot go to the route");
  //     return <Navigate to="/" />;
  //   }
  //   return children;
  // };
  

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/homeScreen"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeScreen"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
