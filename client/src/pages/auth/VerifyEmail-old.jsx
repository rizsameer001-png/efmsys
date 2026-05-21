// client/src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState('verifying');
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('no_token');
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      await authApi.verifyEmail(token);
      setStatus('success');
      showToast('Email verified successfully!', 'success');
    } catch (error) {
      setStatus('error');
      showToast(error.response?.data?.error || 'Verification failed', 'error');
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }
    setResendLoading(true);
    try {
      await authApi.sendVerificationEmail(email);
      showToast('Verification email sent!', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified.
          </p>
          <Link to="/login">
            <Button>Login to your account</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'no_token') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 mb-4">
            Enter your email to receive a verification link.
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleResend} isLoading={resendLoading} className="w-full">
            Send Verification Email
          </Button>
          <Link to="/login" className="block mt-4 text-sm text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
        <p className="text-gray-600 mb-6">
          The verification link is invalid or has expired.
        </p>
        <Link to="/login">
          <Button>Back to Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;