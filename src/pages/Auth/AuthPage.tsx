import React, {  useState, type ReactNode } from 'react';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    clearError,
    handleHandshake,
    handleLogin,
    handleOtpValidation,
    handleOtpAuthentication
  } = useAuth();

  //   useEffect(() => {
  //   const initSession = async () => {
  //     try {
  //       await handleHandshake();
  //       console.log("Handshake successful");
  //     } catch (err) {
  //       console.error("Handshake failed on load", err);
  //     }
  //   };

  //   initSession();
  // }, []);

  const navigateTo = (nextStep: AuthStep) => {
    clearError();
    setStep(nextStep);
    if (nextStep !== 'LOGIN') {
      setSuccessMessage(null);
    }
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
      if (flow === 'UNBLOCK_FLOW' || flow === 'RECOVERY_FLOW') {
        await handleOtpAuthentication(identifier, otp);
        if (flow === 'UNBLOCK_FLOW') {
          setSuccessMessage("Account successfully unblocked! You can now login.");
          setStep('LOGIN'); // Set step directly to ensure state updates together
        } else {
          navigateTo('CHANGE PASSWORD');
        }
      } else {
        await handleOtpValidation(identifier, otp);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) { }
  };

  const STEP_COMPONENTS: Record<string, ReactNode> = {
    'LOGIN': <LoginStep onNext={onLogin} onUnblock={() => navigateTo('UNBLOCK')} />,
    'OTP': <OtpStep onNext={onOtpSubmit} />,
    'UNBLOCK': <UnblockStep onNext={onUnblockTrigger} />,
    'FORGOT PASSWORD': <RecoveryStep onNext={(id, type) => {
      if (type === 'USER_ID') {
        setSuccessMessage(`User ID recovery email has been sent to ${id}`);
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
      {/* 1. Show message at the top for better visibility */}
      {successMessage && step === 'LOGIN' && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm font-medium animate-in fade-in duration-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {STEP_COMPONENTS[step]}

      {step === 'LOGIN' && (
        <div className='mt-6 flex justify-center'>
          <button
            type='button'
            onClick={() => { /* Handle QR Logic */ }}
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
        {step === 'LOGIN' && (
          <button
            type='button'
            onClick={() => { }}
            className='text-[#0f62fe] text-xs font-medium hover:underline'
          >
            Guest Login
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default AuthPage;