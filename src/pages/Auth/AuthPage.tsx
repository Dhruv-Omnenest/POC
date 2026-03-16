import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';

// Define the steps for better type safety
type AuthStep = 'LOGIN' | 'OTP';

const AuthPage: React.FC = () => {
  
  // Extract actions and state from your Zustand store
  const { 
    executeHandshake, 
    executeLogin, 
    executeOtpValidation, 
    isLoading, 
    error 
  } = useAuthStore();

  // Local state management
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  /**
   * Step 1 & 2: Perform Handshake and Trigger OTP
   */
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // First, get the bffPublicKey
      await executeHandshake();
      // Then, send credentials to trigger OTP
      await executeLogin(username, password);
      setStep('OTP');

    } catch (err) {
      // Errors are caught and stored in Zustand 'error' state automatically
      console.error("Login sequence failed", err);
    }
  };

  /**
   * Step 3: Validate OTP and finalize session
   */
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Convert string input to number for your API requirement
      await executeOtpValidation(username, Number(otp));
      console.log("Success");
    } catch (err) {
      console.error("OTP validation failed", err);
    }
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
              : `Enter the code sent for ${username}`}
          </p>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={step === 'LOGIN' ? handleLoginSubmit : handleOtpSubmit} className="space-y-5">
          {step === 'LOGIN' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  placeholder="E.G. AMITH1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-center">One-Time Password</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-2xl tracking-[1em] font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                autoFocus
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                Processing...
              </span>
            ) : (
              step === 'LOGIN' ? 'Continue' : 'Verify & Login'
            )}
          </button>

          {step === 'OTP' && (
            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="w-full text-sm text-slate-500 hover:text-blue-600 transition"
            >
              Back to credentials
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;