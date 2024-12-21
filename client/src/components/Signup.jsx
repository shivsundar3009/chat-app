import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { User, Mail, Phone, Lock, Calendar } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define Zod schema for form validation
const signupSchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  number: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  gender: z.enum(['male', 'female', 'other'], 'Select a gender'),
  age: z
    .number({ invalid_type_error: 'Age is required and must be a number' })
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Age must not exceed 100'),
});

function Signup() {
  const navigate = useNavigate();

  // React Hook Form setup with Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5173/api/userRoutes/createUser', data);
      reset(); // Clear the form on success
      toast.success(response?.data?.message); // Show success toast
      navigate('/', { state: { success: true } }); // Navigate immediately
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Error registering user');
    }
  };
  
  

  return (
    <div style={{ backgroundColor: '#EDEDED' }} className="h-screen flex items-center justify-center">
     
      <div className="bg-[#f0f2f5] bg-opacity-95 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <User className="text-[#128C7E] mr-3" />
            <input
              type="text"
              {...register('userName')}
              className="w-full px-3 py-2 bg-transparent focus:outline-none"
              placeholder="Username"
            />
          </div>
          {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}

          {/* Email */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <Mail className="text-[#128C7E] mr-3" />
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 bg-transparent focus:outline-none"
              placeholder="Email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* Phone Number */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <Phone className="text-[#128C7E] mr-3" />
            <input
              type="tel"
              {...register('number')}
              className="w-full px-3 py-2 bg-transparent focus:outline-none"
              placeholder="Phone Number"
            />
          </div>
          {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}

          {/* Password */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <Lock className="text-[#128C7E] mr-3" />
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 bg-transparent focus:outline-none"
              placeholder="Password"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {/* Gender */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <User className="text-[#128C7E] mr-3" />
            <div className="flex gap-4 w-full">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="male"
                  {...register('gender')}
                  className="radio radio-sm radio-accent mr-2"
                />
                <span className="text-sm">Male</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className="radio radio-sm radio-accent mr-2"
                />
                <span className="text-sm">Female</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="other"
                  {...register('gender')}
                  className="radio radio-sm radio-accent mr-2"
                />
                <span className="text-sm">Other</span>
              </label>
            </div>
          </div>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}

          {/* Age */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <Calendar className="text-[#128C7E] mr-3" />
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-transparent focus:outline-none"
              placeholder="Age"
            />
          </div>
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-[#25D366] text-white font-bold rounded-md shadow-md hover:bg-[#20c05c] focus:outline-none"
            >
              Sign Up
            </button>
          </div>

          {/* Optional: Link to Login */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-[#128C7E] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
