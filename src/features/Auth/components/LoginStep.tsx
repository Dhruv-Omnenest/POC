import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { loginSchema, type LoginFormData } from '../schema/login.schema';
import { AuthStepWrapper } from './AuthStepWrapper';

export const LoginStep: React.FC<{ onNext: (data: LoginFormData) => void; onUnblock: () => void }> = ({ onNext, onUnblock }) => {
  // 1. Get error and clearError from the hook
  const { isLoading, error, clearError } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // 2. Clear previous errors when the user starts typing again
  const handleInputChange = () => {
    if (error && error !== "USER_LOCKED") {
      clearError();
    }
  };

  return (
    <AuthStepWrapper
      title="Welcome to Nest app"
      buttonText="Login"
      isLoading={isLoading}
      // 3. THIS IS KEY: If it's a normal error (not USER_LOCKED), 
      // it passes through to the wrapper's error display.
      error={error === "USER_LOCKED" ? null : error} 
      onSubmit={handleSubmit(onNext)}
    >
      {/* 4. The Special Blocked Prompt */}
      {error === "USER_LOCKED" && (
        <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
          <p className="text-red-600 text-xs flex justify-between items-center">
            User is blocked. 
            <button 
              type="button" 
              onClick={onUnblock} 
              className="font-bold underline uppercase ml-2 hover:text-red-800 transition-colors"
            >
              Unblock User
            </button>
          </p>
        </div>
      )}

      <InputField 
        label="Mobile no. / Email / Client ID" 
        placeholder="Enter Mobile no. / Email"
        registration={register("username", { onChange: handleInputChange })} 
        error={errors.username?.message} 
      />

      <InputField 
        label="Password / MPIN" 
        type="password"
        placeholder="Enter Password / MPIN"
        registration={register("password", { onChange: handleInputChange })} 
        error={errors.password?.message} 
      />
    </AuthStepWrapper>
  );
};