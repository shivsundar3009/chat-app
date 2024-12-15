import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import Login from './components/Login';
import Signup from './components/Signup';
import NotFound from './components/NotFound';
import { ToastContainer } from 'react-toastify'; // To display toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

function App() {

  return (
    
    <Router>
      <Routes>
        <Route path="/homeScreen" element={<HomeScreen />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ToastContainer will handle displaying toasts */}
      <ToastContainer />
    </Router>
  );
}

export default App;
