import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { AuthLayout } from './components/AuthLayout';
import { InputField } from '../../shared/components/InputField';
import { OtpInput } from '../../shared/components/OtpInput';
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from './schema/login.schema';
import { changePasswordSchema, type ChangePasswordFormData } from './schema/changePassword.schema';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './schema/forgotPassword.schema';
import { forgotUserIdSchema, type ForgotUserIdFormData } from './schema/forgotUserId.schema';
type AuthStep = 'LOGIN' | 'OTP' | 'CHANGE PASSWORD' | 'FORGOT PASSWORD';
type AuthFlow = 'LOGIN_FLOW' | 'RECOVERY_FLOW';
type RecoveryTab = 'USER_ID' | 'PASSWORD';
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [flow, setFlow] = useState<AuthFlow>('LOGIN_FLOW');
  const [recoveryTab, setRecoveryTab] = useState<RecoveryTab>('PASSWORD');
  const { 
    executeHandshake, 
    executeLogin, 
    executeOtpValidation, 
    executeForgotPassword, 
    executeForgotUserId,
    executeChangePassword,
    isLoading, 
    error,
    user 
  } = useAuthStore();

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });
  const forgotUserIdForm = useForm<ForgotUserIdFormData>({ resolver: zodResolver(forgotUserIdSchema) });
  const changePasswordForm = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setFlow('LOGIN_FLOW');
      await executeHandshake();
      await executeLogin(data.username, data.password);
      setStep('OTP');
    } catch (err) { console.error(err); }
  };

  const onForgotSubmit = async (data: any) => {
    try {
      setFlow('RECOVERY_FLOW');
      if (recoveryTab === 'USER_ID') {
        await executeForgotUserId(data.pan, data.email);
      } else {
        await executeForgotPassword(data.pan, data.clientId);
      }
      setStep('OTP'); 
    } catch (err) { console.error(err); }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      let identifier = "";
      
      if (flow === 'LOGIN_FLOW') {
        identifier = loginForm.getValues("username");
      } else {
        if (recoveryTab === 'PASSWORD') {
          identifier = forgotPasswordForm.getValues("clientId");
        } else {
          identifier = user?.username || forgotUserIdForm.getValues("email");
        }
      }
      await executeOtpValidation(identifier, Number(data.otp));
      
      if (flow === 'RECOVERY_FLOW') {
        recoveryTab === 'PASSWORD' ? setStep('CHANGE PASSWORD') : setStep('LOGIN');
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) { console.error(err); }
  };

  const onChangePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await executeChangePassword(data.oldPassword, data.newPassword);
      setStep('LOGIN');
      alert("Password updated successfully.");
    } catch (err) { console.error(err); }
  };

  const handleTabChange = (tab: RecoveryTab) => {
    setRecoveryTab(tab);
    forgotPasswordForm.reset();
    forgotUserIdForm.reset();
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-[15px] font-semibold text-[#2f2f2f]">
          {step === 'LOGIN' && 'Welcome to Nest app'}
          {step === 'OTP' && 'Verify Identity'}
          {step === 'FORGOT PASSWORD' && 'Account Recovery'}
          {step === 'CHANGE PASSWORD' && 'Set Password'}
        </h2>
      </div>

      {step === 'FORGOT PASSWORD' && (
        <div className="mb-6 flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => handleTabChange('PASSWORD')}
            className={`flex-1 pb-3 text-xs font-medium transition-colors ${
              recoveryTab === 'PASSWORD' 
                ? 'border-b-2 border-[#0f62fe] text-[#0f62fe]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Forgot Password
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('USER_ID')}
            className={`flex-1 pb-3 text-xs font-medium transition-colors ${
              recoveryTab === 'USER_ID' 
                ? 'border-b-2 border-[#0f62fe] text-[#0f62fe]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Forgot User ID
          </button>
        </div>
      )}

      <form
        onSubmit={
          step === 'LOGIN' ? loginForm.handleSubmit(onLoginSubmit) :
          step === 'OTP' ? otpForm.handleSubmit(onOtpSubmit) :
          step === 'FORGOT PASSWORD' ? (
            recoveryTab === 'USER_ID' 
              ? forgotUserIdForm.handleSubmit(onForgotSubmit) 
              : forgotPasswordForm.handleSubmit(onForgotSubmit)
          ) :
          changePasswordForm.handleSubmit(onChangePasswordSubmit)
        }
        className="space-y-4"
      >
        {step === 'LOGIN' && (
          <>
            <InputField label="Mobile no. / Email / Client ID" placeholder="Enter Mobile no. / Email" registration={loginForm.register("username")} error={loginForm.formState.errors.username?.message} />
            <InputField label="Password / MPIN" type="password" placeholder="Enter password / MPIN" registration={loginForm.register("password")} error={loginForm.formState.errors.password?.message} />
          </>
        )}

        {step === 'FORGOT PASSWORD' && (
          <>
            {recoveryTab === 'PASSWORD' ? (
              <>
                <InputField label="Client ID" placeholder="Enter Client ID" registration={forgotPasswordForm.register("clientId")} error={forgotPasswordForm.formState.errors.clientId?.message} />
                <InputField label="PAN" placeholder="Enter PAN" registration={forgotPasswordForm.register("pan")} error={forgotPasswordForm.formState.errors.pan?.message} />
              </>
            ) : (
              <>
                <InputField label="PAN" placeholder="Enter PAN" registration={forgotUserIdForm.register("pan")} error={forgotUserIdForm.formState.errors.pan?.message} />
                <InputField label="Registered Email" placeholder="Enter your email" registration={forgotUserIdForm.register("email")} error={forgotUserIdForm.formState.errors.email?.message} />
                <p className="text-[11px] text-slate-500 italic">We will send your User ID to your registered email.</p>
              </>
            )}
          </>
        )}

        {step === 'OTP' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-[#2f2f2f]">Enter OTP</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Sent to {flow === 'LOGIN_FLOW' 
                  ? loginForm.getValues("username") 
                  : (recoveryTab === 'PASSWORD' ? forgotPasswordForm.getValues("clientId") : (user?.username || forgotUserIdForm.getValues("email")))}
              </p>
            </div>
            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <OtpInput length={4} value={field.value || ''} onChange={field.onChange} error={otpForm.formState.errors.otp?.message} />
              )}
            />
          </div>
        )}

        {step === 'CHANGE PASSWORD' && (
          <>
            <InputField label="Old Password" type="password" placeholder="Old Password" registration={changePasswordForm.register("oldPassword")} error={changePasswordForm.formState.errors.oldPassword?.message} />
            <InputField label="New Password" type="password" placeholder="New Password" registration={changePasswordForm.register("newPassword")} error={changePasswordForm.formState.errors.newPassword?.message} />
            <InputField label="Re-enter New Password" type="password" placeholder="Confirm New Password" registration={changePasswordForm.register("confirmPassword")} error={changePasswordForm.formState.errors.confirmPassword?.message} />
          </>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200"
        >
          {isLoading ? "Processing..." : 
            step === 'LOGIN' ? 'Login' : 
            step === 'OTP' ? 'Verify' : 
            step === 'FORGOT PASSWORD' ? 'Proceed' : 
            'Set Password'
          }
        </button>
      </form>

      <div className='mt-4'>
        {step === 'LOGIN' && (
          <div className='flex w-full items-center justify-between'>
            <button
              type='button'
              onClick={() => {
                forgotPasswordForm.reset();
                forgotUserIdForm.reset();
                setStep('FORGOT PASSWORD');
                setRecoveryTab('PASSWORD');
              }}
              className='text-[#0f62fe] text-xs hover:underline'
            >
              Forgot user ID or password?
            </button>
            <button type='button' className='text-[#0f62fe] text-xs hover:underline'>Guest Login</button>
          </div>
        )}
        
        {step !== 'LOGIN' && (
          <button 
            type="button"
            onClick={() => {
              setStep('LOGIN');
              setFlow('LOGIN_FLOW');
            }} 
            className="text-xs text-slate-500 hover:text-[#0f62fe]"
          >
            ← Back to Login
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default AuthPage;