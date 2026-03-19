import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schema/forgotPassword.schema';
import { forgotUserIdSchema, type ForgotUserIdFormData } from '../schema/forgotUserId.schema';
import type { RecoveryTab } from '../types/auth';
import { AuthStepWrapper } from './AuthStepWrapper';

interface RecoveryStepProps {
  onNext: (id: string, type: RecoveryTab) => void;
}

export const RecoveryStep: React.FC<RecoveryStepProps> = ({ onNext }) => {
  const [tab, setTab] = useState<RecoveryTab>('PASSWORD');
  const { isLoading, error, clearError, handleForgotPassword, handleForgotUserId } = useAuth();

  const pwForm = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });
  const idForm = useForm<ForgotUserIdFormData>({ resolver: zodResolver(forgotUserIdSchema) });

  const handleTabChange = (newTab: RecoveryTab) => {
    clearError();
    setTab(newTab);
  };

  const onSubmit = async (data: any) => {
    try {
      if (tab === 'PASSWORD') {
        await handleForgotPassword(data.pan, data.clientId);
        onNext(data.clientId, 'PASSWORD'); 
      } else {
        await handleForgotUserId(data.pan, data.email);
        onNext(data.email, 'USER_ID'); 
      }
    } catch (err) {
      
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-100">
        {(['PASSWORD', 'USER_ID'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`flex-1 pb-3 text-xs font-medium transition-colors ${
              tab === t ? 'border-b-2 border-[#0f62fe] text-[#0f62fe]' : 'text-gray-400'
            }`}
          >
            {t === 'PASSWORD' ? 'Forgot Password' : 'Forgot User ID'}
          </button>
        ))}
      </div>

      <AuthStepWrapper
        title="Account Recovery"
        buttonText="Proceed"
        isLoading={isLoading}
        error={error}
        onSubmit={tab === 'PASSWORD' ? pwForm.handleSubmit(onSubmit) : idForm.handleSubmit(onSubmit)}
      >
        {tab === 'PASSWORD' ? (
          <>
            <InputField 
              label="Client ID" 
              placeholder="Enter Client ID"
              registration={pwForm.register("clientId")} 
              error={pwForm.formState.errors.clientId?.message} 
            />
            <InputField 
              label="PAN" 
              placeholder="Enter PAN"
              registration={pwForm.register("pan")} 
              error={pwForm.formState.errors.pan?.message} 
            />
          </>
        ) : (
          <>
            <InputField 
              label="PAN" 
              placeholder="Enter PAN"
              registration={idForm.register("pan")} 
              error={idForm.formState.errors.pan?.message} 
            />
            <InputField 
              label="Registered Email" 
              placeholder="Enter Email Address"
              registration={idForm.register("email")} 
              error={idForm.formState.errors.email?.message} 
            />
          </>
        )}
      </AuthStepWrapper>
    </div>
  );
};