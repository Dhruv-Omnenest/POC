// UnblockStep.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../../../shared/components/InputField';
import { AuthStepWrapper } from './AuthStepWrapper';
import { useAuth } from '../hooks/useAuth';

const unblockSchema = z.object({
  username: z.string().min(1, "User ID is required"),
  panNumber: z.string().length(10, "Invalid PAN card format"),
});

export const UnblockStep: React.FC<{ onNext: (username: string) => void }> = ({ onNext }) => {
  const { handleUnblockUser, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(unblockSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      await handleUnblockUser(data.panNumber, data.username);
      onNext(data.username)
    } catch (e) {}
  };

  return (
    <AuthStepWrapper title="Unblock User" buttonText="Send OTP" isLoading={isLoading} error={error} onSubmit={handleSubmit(onSubmit)}>
      <InputField label="User ID" registration={register("username")} error={errors.username?.message} />
      <InputField label="PAN Number" registration={register("panNumber")} error={errors.panNumber?.message} />
    </AuthStepWrapper>
  );
};