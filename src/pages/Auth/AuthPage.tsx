import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { type LoginFormData, type OtpFormData } from '../../schemas/auth.schema';
import { LoginForm } from '../../components/Auth/LoginForm';
import { OtpForm } from '../../components/Auth/OtpForm';

// Define the steps for better type safety
type AuthStep = 'LOGIN' | 'OTP';

const AuthPage: React.FC = () => {
  const {
    executeHandshake,
    executeLogin,
    executeOtpValidation,
    isLoading,
    error
  } = useAuthStore();

  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [username, setUsername] = useState<string>('');

  /**
   * Step 1 & 2: Perform Handshake and Trigger OTP
   */
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      // First, get the bffPublicKey
      await executeHandshake();
      // Then, send credentials to trigger OTP
      await executeLogin(data.username, data.password);
      setUsername(data.username);
      setStep('OTP');
    } catch (err) {
      console.error("Login sequence failed", err);
    }
  };

  /**
   * Step 3: Validate OTP and finalize session
   */
  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      await executeOtpValidation(username, Number(data.otp));
      console.log("Success");
    } catch (err) {
      console.error("OTP validation failed", err);
    }
  };

  const handleBackToLogin = () => {
    setStep('LOGIN');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 'LOGIN' ? 'Trading Login' : 'Verify Identity'}
          </h1>
          <p className="text-slate-500 mt-2">
            {step === 'LOGIN'
              ? 'Enter your account details'
              : `Enter the code sent to your registered device for ${username || "your account"}`}
          </p>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Reusable Form Components */}
        {step === 'LOGIN' ? (
          <LoginForm onSubmit={onLoginSubmit} isLoading={isLoading} />
        ) : (
          <OtpForm onSubmit={onOtpSubmit} onBack={handleBackToLogin} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;