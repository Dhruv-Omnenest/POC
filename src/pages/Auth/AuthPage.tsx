import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/auth.store';
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from '../../schema/auth.schema';
import { AuthLayout } from './components/AuthLayout';
import { InputField } from '../../shared/components/InputField';
import { OtpInput } from '../../shared/components/OtpInput';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const { executeHandshake, executeLogin, executeOtpValidation, executeForgetUserId, isLoading, error } = useAuthStore();

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await executeHandshake();
      await executeLogin(data.username, data.password);
      setStep('OTP');
    } catch (err) { console.error(err); }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      const username = loginForm.getValues("username");
      await executeOtpValidation(username, Number(data.otp));
      navigate('/dashboard', { replace: true });
    } catch (err) { console.error(err); }
  };

  return (
    <AuthLayout>
      <div className="mb-10 ">
        <h2 className="text-[15px] font-semibold text-[#2f2f2f]">
          {step === 'LOGIN' ? 'Welcome to Nest app' : 'Verify Identity'}
        </h2>
      </div>

      <form
        onSubmit={step === 'LOGIN' ? loginForm.handleSubmit(onLoginSubmit) : otpForm.handleSubmit(onOtpSubmit)}
        className="space-y-4"
      >
        {step === 'LOGIN' ? (
          <>
            <InputField
              label="Mobile no. / Email / Client ID"
              placeholder="Enter Mobile no. / Email"
              autoComplete="username"
              registration={loginForm.register("username")}
              error={loginForm.formState.errors.username?.message}
            />
            <InputField
              label="Password / MPIN"
              type="password"
              placeholder="Enter password / MPIN"
              autoComplete="current-password"
              registration={loginForm.register("password")}
              error={loginForm.formState.errors.password?.message}
            />
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-[#2f2f2f]">Enter OTP</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Sent to {loginForm.getValues("username") || "your account"}
              </p>
            </div>
            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  length={4}
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={otpForm.formState.errors.otp?.message}
                />
              )}
            />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200 disabled:text-slate-500"
        >
          {isLoading ? "Processing..." : (step === 'LOGIN' ? 'Login' : 'Verify & Login')}
        </button>
      </form>
     <div className='mt-4'>
  {step !== 'OTP' && (
    <div className='flex w-full items-center justify-between'>
      <button
        type='button'
        onClick={() => executeForgetUserId("AMITH1234A", "amit.gupta@omnenest.com")}
        className='text-[#0f62fe] text-xs hover:underline'
      >
        Forgot user ID or password?
      </button>

      <button
        type='button'
        className='text-[#0f62fe] text-xs hover:underline'
      >
        Guest Login
      </button>
    </div>
  )}
</div>
    </AuthLayout>
  );
};

export default AuthPage;