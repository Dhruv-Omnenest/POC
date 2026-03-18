import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { OtpInput } from '../../../shared/components/OtpInput';
import { otpSchema, type OtpFormData } from '../schema/login.schema';
import { AuthStepWrapper } from './AuthFormWrapper';

interface OtpStepProps {
  onNext: (data: OtpFormData) => void;
  onResend?: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({ onNext, onResend }) => {
  const { isLoading, error } = useAuth();
  
  const { control, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  return (
    <AuthStepWrapper
      title="Verify Identity"
      buttonText="Verify OTP"
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit(onNext)}
    >
      <div className="py-2">
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <OtpInput 
              length={4} 
              value={field.value} 
              onChange={field.onChange} 
              error={errors.otp?.message}
              onResend={onResend} // Pass down the resend logic
            />
          )}
        />
        <p className="mt-4 text-xs text-slate-500 leading-relaxed text-center">
          We've sent a 4-digit verification code to your <br /> 
          registered mobile number and email.
        </p>
      </div>
    </AuthStepWrapper>
  );
};