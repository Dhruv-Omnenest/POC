import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from '../../schema/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

type AuthStep = 'LOGIN' | 'OTP';
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    executeHandshake,
    executeLogin,
    executeOtpValidation,
    isLoading,
    error
  } = useAuthStore();

  const [step, setStep] = useState<AuthStep>('LOGIN');

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmitRHF,
    formState: { errors: loginErrors },
    getValues: getLoginValues
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmitRHF,
    formState: { errors: otpErrors }
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema)
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await executeHandshake();
      await executeLogin(data.username, data.password);
      setStep('OTP');
    } catch (err) {
      console.error("Login sequence failed", err);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      await executeOtpValidation(getLoginValues("username"), Number(data.otp));
      navigate('/dashboard', { replace: true });
      console.log("Success");
    } catch (err) {
      console.error("OTP validation failed", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
    <div className="hidden md:flex md:w-1/2 h-screen p-6">
  <div className="w-full h-full bg-[#0f62fe] rounded-3xl flex flex-col items-center justify-center p-12">
    
    <div className="max-w-109.25 w-full text-center text-white mb-10">
      <h1 className="font-['Inter'] text-[32px] leading-[140%] tracking-tight">
        <span className="font-normal">Take Charge </span>
        <br />
        <span className="font-bold">of Your Investments with Us</span>
      </h1>
    </div>

    <div className="flex justify-center">
      <img
        src="/src/assets/auth.svg"
        alt="Investment Illustration"
        className="w-full h-auto object-contain transform scale-110" 
      />
    </div>
    
  </div>
</div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-start mb-8">
      <img 
        src="/src/assets/logo.svg" 
        alt="Nest Logo" 
        className="h-12 w-auto mb-4 object-contain" 
      />
      <h2 className="text-xl font-medium text-slate-600">
        Welcome to <span className="text-[#0f62fe] font-bold">Nest app</span>
      </h2>
    </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <form
            onSubmit={step === 'LOGIN' ? handleLoginSubmitRHF(onLoginSubmit) : handleOtpSubmitRHF(onOtpSubmit)}
            className="space-y-5"
          >
            {step === 'LOGIN' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile no. / Email /Client ID</label>
                  <input
                    {...registerLogin("username")}
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition uppercase"
                    placeholder="E.G. AMITH1"
                  />
                  {loginErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{loginErrors.username.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password / MPIN</label>
                  <input
                    {...registerLogin("password")}
                    type="password"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="••••••••"
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 text-center">
                  One-Time Password
                </label>
                <input
                  {...registerOtp("otp")}
                  type="text"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                {otpErrors.otp && (
                  <p className="text-red-500 text-xs mt-1 text-center">{otpErrors.otp.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50"
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
                ← Back to credentials
              </button>
            )}
          </form>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;