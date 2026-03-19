import React from 'react';
import { useForm, useWatch } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';
import { changePasswordSchema, type ChangePasswordFormData } from '../schema/changePassword.schema';
import { AuthStepWrapper } from './AuthStepWrapper';
import { Check, X } from 'lucide-react';

interface ChangePasswordProps {
  onNext: () => void;
  username: string; 
}

export const ChangePasswordStep: React.FC<ChangePasswordProps> = ({ onNext, username }) => {
  const { isLoading, error, handleSetPassword } = useAuth();
  const { register, handleSubmit, control, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange"
  });

  // Watch the password field in real-time
  const newPassword = useWatch({ control, name: "newPassword", defaultValue: "" });

  // Define criteria checks
  const criteria = [
    { label: "Minimum 10 characters", met: newPassword.length >= 10 },
    { label: "Minimum 1 digit", met: /\d/.test(newPassword) },
    { label: "Minimum 1 special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
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


           {/* Password Criteria Checklist */}
      <div className="mt-2 mb-6 space-y-2">
        {criteria.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {item.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span className={item.met ? "text-green-700" : "text-gray-500"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </AuthStepWrapper>
  );
};