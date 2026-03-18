import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { loginSchema, type LoginFormData } from '../schema/login.schema';
import { AuthStepWrapper } from './AuthFormWrapper';


export const LoginStep: React.FC<{ onNext: (data: LoginFormData) => void }> = ({ onNext }) => {
  const { isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <AuthStepWrapper
      title="Welcome to Nest app"
      buttonText="Login"
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit(onNext)}
    >
      <InputField 
        label="Mobile no. / Email / Client ID" 
        placeholder="Enter Mobile no. / Email" 
        registration={register("username")} 
        error={errors.username?.message} 
      />
      <InputField 
        label="Password / MPIN" 
        type="password" 
        placeholder="Enter password / MPIN" 
        registration={register("password")} 
        error={errors.password?.message} 
      />
    </AuthStepWrapper>
  );
};