import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthFlow, AuthStep } from '../../features/Auth/types/auth';
import { useAuth } from '../../features/Auth/hooks/useAuth';
import { LoginStep } from '../../features/Auth/components/LoginStep';
import { AuthLayout } from '../../features/Auth/components/AuthLayout';
import { RecoveryStep } from '../../features/Auth/components/RecoveryStep';
import { ChangePasswordStep } from '../../features/Auth/components/ChangePassword';
import { OtpStep } from '../../features/Auth/components/OtpStep';
import { UnblockStep } from '../../features/Auth/components/UnblockStep';
import QrIcon from "../../assets/qr.svg";
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [flow, setFlow] = useState<AuthFlow>('LOGIN_FLOW');
  const [identifier, setIdentifier] = useState("");

  const {
    clearError,
    handleHandshake,
    handleLogin,
    handleOtpValidation,
    handleUnblockOtpValidation
  } = useAuth();

  const navigateTo = (nextStep: AuthStep) => {
    clearError();
    setStep(nextStep);
  };

  const onLogin = async (data: any) => {
    try {
      setFlow('LOGIN_FLOW');
      setIdentifier(data.username);
      await handleHandshake();
      await handleLogin(data.username, data.password);
      navigateTo('OTP');
    } catch (err) { }
  };

  const onUnblockTrigger = (username: string) => {
    setIdentifier(username);
    setFlow('UNBLOCK_FLOW');
    navigateTo('OTP');
  };

  const onOtpSubmit = async (data: any) => {
    try {
      const otp = Number(data.otp);

      if (flow === 'UNBLOCK_FLOW') {
        await handleUnblockOtpValidation(identifier, otp);
        alert("Account unblocked! You can now login.");
        navigateTo('LOGIN');
      } else {
        await handleOtpValidation(identifier, otp);
        if (flow === 'RECOVERY_FLOW') {
          navigateTo('CHANGE PASSWORD');
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) { }
  };

  const STEP_COMPONENTS: Record<string, React.ReactNode> = {
    'LOGIN': <LoginStep onNext={onLogin} onUnblock={() => navigateTo('UNBLOCK')} />,
    'OTP': <OtpStep onNext={onOtpSubmit} />,
    'UNBLOCK': <UnblockStep onNext={onUnblockTrigger} />,
    'FORGOT PASSWORD': <RecoveryStep onNext={(id, type) => {
      if (type === 'USER_ID') {
        alert(`User ID recovery email has been sent to ${id}`);
        navigateTo('LOGIN');
      } else {
        setFlow('RECOVERY_FLOW');
        setIdentifier(id);
        navigateTo('OTP');
      }
    }} />,
    'CHANGE PASSWORD': <ChangePasswordStep username={identifier} onNext={() => navigateTo('LOGIN')} />
  };

  return (
    <AuthLayout>
      {STEP_COMPONENTS[step]}
   {step === 'LOGIN' && (
  <div className='mt-6 flex justify-center'>
    <button
      type='button'
      onClick={() => {/* Handle QR Logic */}}
      className='flex items-center gap-2 text-[#0f62fe] text-sm font-medium hover:underline'
    >
      <img src={QrIcon} alt="QR Code" className="w-4 h-4" />
      Login with QR
    </button>
  </div>
)}
      <div className='mt-4 pt-2 border-t border-gray-50 flex justify-between '>
        <button
          type='button'
          onClick={() => navigateTo(step === 'LOGIN' ? 'FORGOT PASSWORD' : 'LOGIN')}
          className='text-[#0f62fe] text-xs font-medium hover:underline'
        >
          {step === 'LOGIN' ? "Forgot user ID or password?" : "← Back to Login"}
        </button>
        <button
          type='button'
          onClick={() => navigateTo(step === 'LOGIN' ? 'FORGOT PASSWORD' : 'LOGIN')}
          className='text-[#0f62fe] text-xs font-medium hover:underline'
        >
          {step === 'LOGIN' ? "Guest Login" : ""}
        </button>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;