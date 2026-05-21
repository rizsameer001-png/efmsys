// client/src/pages/auth/Login.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import { useToast } from '../../hooks/useToast';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { showToast } = useToast();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await login(formData.email, formData.password);
//       showToast('Login successful!', 'success');
//       navigate('/dashboard');
//     } catch (error) {
//       const message = error.response?.data?.error || 'Login failed. Please check your credentials.';
//       showToast(message, 'error');
//       setErrors({ general: message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* Logo and Title */}
//         <div className="text-center">
//           <Link to="/" className="inline-flex items-center justify-center space-x-2">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
//               <span className="text-white text-2xl font-bold">F</span>
//             </div>
//           </Link>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             Welcome Back
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to your account to continue
//           </p>
//         </div>

//         {/* Demo Credentials Info */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
//           <div className="space-y-1 text-xs text-blue-700">
//             <p>📧 superadmin@fms.com / Admin@123 (Super Admin)</p>
//             <p>📧 admin@fms.com / Admin@123 (Admin)</p>
//             <p>📧 manager@fms.com / Admin@123 (Manager)</p>
//             <p>📧 technician1@fms.com / Admin@123 (Technician)</p>
//             <p className="text-blue-600 mt-1">🔐 New customer? Register using the link below</p>
//           </div>
//         </div>

//         {/* Login Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {errors.general && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-800">{errors.general}</p>
//             </div>
//           )}
          
//           <Input
//             label="Email Address"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={errors.email}
//             placeholder="you@example.com"
//             required
//           />
          
//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             error={errors.password}
//             placeholder="••••••••"
//             required
//           />
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                 Remember me
//               </label>
//             </div>
            
//             <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
//               Forgot password?
//             </Link>
//           </div>
          
//           <Button type="submit" isLoading={isLoading} className="w-full">
//             Sign in
//           </Button>
//         </form>

//         {/* Register Link for New Customers */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">New to FMS?</span>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <Link
//               to="/register"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//             >
//               Create New Account
//             </Link>
//           </div>
          
//           <p className="mt-4 text-center text-xs text-gray-500">
//             By signing in, you agree to our{" "}
//             <a href="/terms" className="text-blue-600 hover:text-blue-500">
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a href="/privacy" className="text-blue-600 hover:text-blue-500">
//               Privacy Policy
//             </a>
//           </p>
//         </div>

//         {/* Customer Support */}
//         <div className="text-center">
//           <p className="text-xs text-gray-400">
//             Need help?{" "}
//             <a href="/contact" className="text-blue-600 hover:text-blue-500">
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// client/src/pages/auth/Login.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import { useToast } from '../../hooks/useToast';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { showToast } = useToast();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await login(formData.email, formData.password);
//       // Login successful - toast is shown in AuthContext
//       navigate('/dashboard');
//     } catch (error) {
//       // Error is already handled in AuthContext with toast
//       // Just set the general error for the form
//       const message = error.response?.data?.error || 
//                      error.response?.data?.message ||
//                      'Login failed. Please check your credentials.';
//       setErrors({ general: message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* Logo and Title */}
//         <div className="text-center">
//           <Link to="/" className="inline-flex items-center justify-center space-x-2">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
//               <span className="text-white text-2xl font-bold">F</span>
//             </div>
//           </Link>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             Welcome Back
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to your account to continue
//           </p>
//         </div>

//         {/* Demo Credentials Info */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
//           <div className="space-y-1 text-xs text-blue-700">
//             <p>📧 superadmin@fms.com / SuperAdmin@123 (Super Admin)</p>
//             <p>📧 admin@fms.com / Admin@123 (Admin)</p>
//             <p>📧 manager@fms.com / Manager@123 (Manager)</p>
//             <p>📧 technician@fms.com / Technician@123 (Technician)</p>
//             <p className="text-blue-600 mt-1">🔐 New customer? Register using the link below</p>
//           </div>
//         </div>

//         {/* Login Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {errors.general && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-800">{errors.general}</p>
//             </div>
//           )}
          
//           <Input
//             label="Email Address"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={errors.email}
//             placeholder="you@example.com"
//             required
//           />
          
//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             error={errors.password}
//             placeholder="••••••••"
//             required
//           />
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                 Remember me
//               </label>
//             </div>
            
//             <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
//               Forgot password?
//             </Link>
//           </div>
          
//           <Button type="submit" isLoading={isLoading} className="w-full">
//             Sign in
//           </Button>
//         </form>

//         {/* Register Link for New Customers */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">New to FMS?</span>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <Link
//               to="/register"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//             >
//               Create New Account
//             </Link>
//           </div>
          
//           <p className="mt-4 text-center text-xs text-gray-500">
//             By signing in, you agree to our{" "}
//             <a href="/terms" className="text-blue-600 hover:text-blue-500">
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a href="/privacy" className="text-blue-600 hover:text-blue-500">
//               Privacy Policy
//             </a>
//           </p>
//         </div>

//         {/* Customer Support */}
//         <div className="text-center">
//           <p className="text-xs text-gray-400">
//             Need help?{" "}
//             <a href="/contact" className="text-blue-600 hover:text-blue-500">
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// client/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      // Login successful - toast is shown in AuthContext
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in AuthContext with toast
      // Just set the general error for the form
      const message = error.response?.data?.error || 
                     error.response?.data?.message ||
                     'Login failed. Please check your credentials.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">F</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-blue-700">
            <p>📧 superadmin@fms.com / SuperAdmin@123 (Super Admin)</p>
            <p>📧 admin@fms.com / Admin@123 (Admin)</p>
            <p>📧 manager@fms.com / Manager@123 (Manager)</p>
            <p>📧 technician@fms.com / Technician@123 (Technician)</p>
            <p className="text-blue-600 mt-1">🔐 New customer? Register using the link below</p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="flex gap-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/verify-email" className="text-sm text-green-600 hover:text-green-500">
                Verify Email
              </Link>
            </div>
          </div>
          
          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign in
          </Button>
        </form>

        {/* Register Link for New Customers */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">New to FMS?</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create New Account
            </Link>
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Customer Support */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;