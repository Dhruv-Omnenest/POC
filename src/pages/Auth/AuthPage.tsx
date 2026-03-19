import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthFlow, AuthStep } from '../../features/Auth/types/auth';
import { useAuth } from '../../features/Auth/hooks/useAuth';
import { LoginStep } from '../../features/Auth/components/LoginStep';
import { AuthLayout } from '../../features/Auth/components/AuthLayout';
import { RecoveryStep } from '../../features/Auth/components/RecoveryStep';
import { ChangePasswordStep } from '../../features/Auth/components/ChangePassword';
import { OtpStep } from '../../features/Auth/components/OtpStep';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [flow, setFlow] = useState<AuthFlow>('LOGIN_FLOW');
  const [identifier, setIdentifier] = useState("");

  const { clearError, handleHandshake, handleLogin, handleOtpValidation } = useAuth();

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
    } catch (err) {}
  };

  const onRecoverySuccess = (id: string, type: 'PASSWORD' | 'USER_ID') => {
    if (type === 'USER_ID') {
      alert("Success! Your User ID has been sent to your registered email address.");
      navigateTo('LOGIN');
    } else {
      setFlow('RECOVERY_FLOW');
      setIdentifier(id); 
      navigateTo('OTP');
    }
  };

  const onOtpSubmit = async (data: any) => {
    try {
      const usernameToSend = identifier; 
      const otpToSend = Number(data.otp);

      if (!usernameToSend) {
        console.error("Username is missing! Identification failed.");
        return;
      }

      await handleOtpValidation(usernameToSend, otpToSend);

      if (flow === 'RECOVERY_FLOW') {
        navigateTo('CHANGE PASSWORD');
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error("OTP Validation Error:", err);
    }
  };

  const STEP_COMPONENTS: Record<AuthStep, React.ReactNode> = {
    'LOGIN': <LoginStep onNext={onLogin} />,
    'OTP': <OtpStep onNext={onOtpSubmit} />,
    'FORGOT PASSWORD': <RecoveryStep onNext={onRecoverySuccess} />,
    'CHANGE PASSWORD': <ChangePasswordStep onNext={() => navigateTo('LOGIN')} />
  };

  return (
    <AuthLayout>
      {STEP_COMPONENTS[step]}

      <div className='mt-4 pt-2 border-t border-gray-50'>
        <button 
          type='button' 
          onClick={() => navigateTo(step === 'LOGIN' ? 'FORGOT PASSWORD' : 'LOGIN')} 
          className='text-[#0f62fe] text-xs font-medium hover:underline'
        >
          {step === 'LOGIN' ? "Forgot user ID or password?" : "← Back to Login"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;