import React from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../redux/features/User/UserSlice';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define validation schema with Zod
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Username or Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema), // Use Zod for schema validation
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://chat-app-60lc.onrender.com/api/authRoutes/loginUser', data, {
        withCredentials: true,
      });

      dispatch(login(response.data.user)); // Dispatch user login
      toast.success('Login successful');
      navigate('/homeScreen');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{ backgroundColor: '#EDEDED' }} // Solid color background
      className="h-screen flex items-center justify-center"
    >
     
      <div className="bg-[#f0f2f5] bg-opacity-95 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Log In</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Username/Email */}
          <div className="flex flex-col">
            <label htmlFor="identifier" className="text-gray-600 font-medium">
              Username or Email
            </label>
            <div className="flex items-center border-b border-gray-300 pb-2">
              <Mail className="text-[#128C7E] mr-3" />
              <input
                type="text"
                id="identifier"
                {...register('identifier')}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
                placeholder="Username or Email"
              />
            </div>
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-600 font-medium">
              Password
            </label>
            <div className="flex items-center border-b border-gray-300 pb-2">
              <Lock className="text-[#128C7E] mr-3" />
              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-[#25D366] text-white font-bold rounded-md shadow-md hover:bg-[#20c05c] focus:outline-none"
            >
              Log In
            </button>
          </div>
        </form>

        {/* Link to Signup */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#128C7E] font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
