import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from '../../schema/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

type AuthStep = 'LOGIN' | 'OTP';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { executeHandshake, executeLogin, executeOtpValidation, isLoading, error } = useAuthStore();
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
    } catch (err) {
      console.error("OTP validation failed", err);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-slate-50 overflow-hidden">
      {/* Main Container */}
      <div className=" flex h-screen w-full max-w-275 overflow-hidden rounded-[22px] ">
        
        {/* Left Panel: Artwork (Hidden on Mobile) */}
        <section className="relative hidden w-[47%] flex-col rounded-[22px] bg-[#0f62fe] text-white lg:flex">
          {/* Pattern Overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_36%),linear-gradient(180deg,#2b6cf6_0%,#1157f0_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
            <div className="pt-12">
              <h1 className="text-3xl font-medium leading-tight text-white">
                Take Charge <br />
                of Your <span className="font-bold">Investments with Us</span>
              </h1>
              <p className="mt-4 text-sm text-blue-100 opacity-80 italic">"Secure your future with Nest"</p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <img src="/src/assets/auth.svg" alt="Artwork" className="h-auto w-full max-w-70" />
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 pb-2">
              <span className="h-1.5 w-5 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>
        </section>

        {/* Right Panel: Form */}
        <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-90">
            <div className="mb-10">
              <img src="/src/assets/logo.svg" alt="Logo" className="mb-6 h-12 w-auto" />
              <h2 className="text-[15px] font-semibold text-[#2f2f2f]">
                Welcome to <span className="text-[#0f62fe]">Nest app</span>
              </h2>
            </div>

            <form 
              onSubmit={step === 'LOGIN' ? handleLoginSubmitRHF(onLoginSubmit) : handleOtpSubmitRHF(onOtpSubmit)}
              className="mt-8 space-y-5"
            >
              {step === 'LOGIN' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-slate-700">Mobile no. / Email / Client ID</label>
                    <input
                      {...registerLogin("username")}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-[#0f62fe] focus:ring-4 focus:ring-blue-500/10 outline-none"
                      placeholder="Enter Mobile no. / Email"
                    />
                    {loginErrors.username && <p className="text-[11px] text-red-500">{loginErrors.username.message}</p>}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-slate-700">Password / MPIN</label>
                    <input
                      {...registerLogin("password")}
                      type="password"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-[#0f62fe] focus:ring-4 focus:ring-blue-500/10 outline-none"
                      placeholder="Enter password / MPIN"
                    />
                    {loginErrors.password && <p className="text-[11px] text-red-500">{loginErrors.password.message}</p>}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#2f2f2f]">Enter OTP</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      OTP sent on {getLoginValues("username") || "your registered account"}
                    </p>
                  </div>
                  <input
                    {...registerOtp("otp")}
                   className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-[#0f62fe] focus:ring-4 focus:ring-blue-500/10 outline-none uppercase"
                    maxLength={4}
                    autoFocus
                  />
                  {otpErrors.otp && <p className="text-center text-[11px] text-red-500">{otpErrors.otp.message}</p>}
                </div>
              )}

              {/* Global Error Display */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {step === 'OTP'}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {isLoading ? "Processing..." : (step === 'LOGIN' ? 'Login' : 'Verify & Login')}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;