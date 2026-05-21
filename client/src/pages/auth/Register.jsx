// client/src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Unit Verification
    buildingCode: '',
    floorNumber: '',
    unitNumber: '',
    ownerName: '',
    
    // Step 2: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // Verify Unit Ownership
  const verifyUnit = async () => {
    const { buildingCode, floorNumber, unitNumber, ownerName } = formData;
    
    if (!buildingCode || !floorNumber || !unitNumber || !ownerName) {
      showToast('Please fill all verification fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyUnit({
        buildingCode,
        floorNumber: parseInt(floorNumber),
        unitNumber,
        ownerName,
      });
      
      if (response.data.valid) {
        setVerificationData(response.data.data);
        setStep(2);
        showToast('Unit verified! Please complete your registration', 'success');
      } else {
        showToast(response.data.message || 'Verification failed', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Customer
  const registerCustomer = async () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    
    // Validation
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.registerCustomer({
        ...formData,
        unitVerification: {
          buildingCode: formData.buildingCode,
          floorNumber: parseInt(formData.floorNumber),
          unitNumber: formData.unitNumber,
          ownerName: formData.ownerName,
        }
      });
      
      if (response.data.success) {
        // Save token for verification
        localStorage.setItem('tempToken', response.data.token);
        showToast('Registration successful! Please verify your email.', 'success');
        navigate('/verify-email');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      verifyUnit();
    } else {
      registerCustomer();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FMS Enterprise</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Customer Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? 'Verify your unit ownership to get started'
              : 'Complete your profile to create an account'
            }
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Verify Unit</span>
            <span>Personal Info</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              // Step 1: Unit Verification
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    Please enter your unit details as provided by your building management.
                    This information will be used to verify your ownership.
                  </p>
                </div>

                <Input
                  label="Building Code"
                  name="buildingCode"
                  value={formData.buildingCode}
                  onChange={handleChange}
                  placeholder="e.g., DTT001"
                  required
                />

                <Input
                  label="Floor Number"
                  name="floorNumber"
                  type="number"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                  required
                />

                <Input
                  label="Unit Number"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  placeholder="e.g., 101"
                  required
                />

                <Input
                  label="Owner Name (as registered)"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
            ) : (
              // Step 2: Personal Information
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800">
                    ✅ Unit Verified: <strong>{verificationData?.buildingName}</strong> - Unit {verificationData?.unitNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                  />
                </div>

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
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+971XXXXXXXXX"
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="At least 6 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 space-y-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  ← Back
                </Button>
              )}
              
              <Button type="submit" isLoading={isLoading} className="w-full">
                {step === 1 ? 'Verify Unit' : 'Create Account'}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Need help?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;