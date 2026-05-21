import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { authApi } from '../../api/auth.api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email is invalid' });
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.sendOTP(email);
      showToast('OTP sent to your email!', 'success');
      setStep('verify');
      setErrors({});
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send OTP';
      showToast(message, 'error');
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.verifyOTP(email, otp);
      showToast('Email verified successfully! You can now login.', 'success');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to verify OTP';
      showToast(message, 'error');
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
            Verify Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'request' 
              ? 'Enter your email to receive verification code' 
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Note:</span> If you already have an account 
            but haven't verified your email, use this page to complete verification.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={step === 'request' ? handleSendOTP : handleVerifyOTP}>
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}
          
          {step === 'request' ? (
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              required
            />
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600">Verifying email:</p>
                <p className="font-medium text-gray-900">{email}</p>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-xs text-blue-600 hover:text-blue-500 mt-1"
                >
                  Change email
                </button>
              </div>
              
              <Input
                label="Verification Code (OTP)"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={errors.otp}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              
              <button
                type="button"
                onClick={handleSendOTP}
                className="text-sm text-blue-600 hover:text-blue-500 text-center w-full"
              >
                Resend OTP
              </button>
            </>
          )}
          
          <Button type="submit" isLoading={isLoading} className="w-full">
            {step === 'request' ? 'Send Verification Code' : 'Verify Email'}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;