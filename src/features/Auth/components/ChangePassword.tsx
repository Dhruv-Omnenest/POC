import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { changePasswordSchema, type ChangePasswordFormData } from '../schema/changePassword.schema';
import { AuthStepWrapper } from './AuthStepWrapper';

interface ChangePasswordProps {
  onNext: () => void;
  username: string; 
}

export const ChangePasswordStep: React.FC<ChangePasswordProps> = ({ onNext, username }) => {
  const { isLoading, error, handleSetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      console.log("Attempting to set password for:", username);
      await handleSetPassword(username, data.newPassword);
      onNext();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <AuthStepWrapper
      title="Create New Password"
      buttonText="Update Password"
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4 text-xs text-gray-500">
        Setting password for: <span className="font-semibold">{username}</span>
      </div>
      
      <InputField 
        label="New Password" 
        type="password" 
        placeholder="Enter at least 10 characters"
        registration={register("newPassword")} 
        error={errors.newPassword?.message} 
      />
      
      <InputField 
        label="Confirm New Password" 
        type="password" 
        placeholder="Repeat your new password"
        registration={register("confirmPassword")} 
        error={errors.confirmPassword?.message} 
      />
    </AuthStepWrapper>
  );
};