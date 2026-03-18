import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { changePasswordSchema, type ChangePasswordFormData } from '../schema/changePassword.schema';
import { AuthStepWrapper } from './AuthFormWrapper';

export const ChangePasswordStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { isLoading, error, handleChangePassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await handleChangePassword(data.oldPassword, data.newPassword);
      onNext();
    } catch (err) {}
  };

  return (
    <AuthStepWrapper
      title="Set New Password"
      buttonText="Update Password"
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField label="Old Password" type="password" registration={register("oldPassword")} error={errors.oldPassword?.message} />
      <InputField label="New Password" type="password" registration={register("newPassword")} error={errors.newPassword?.message} />
      <InputField label="Confirm Password" type="password" registration={register("confirmPassword")} error={errors.confirmPassword?.message} />
    </AuthStepWrapper>
  );
};