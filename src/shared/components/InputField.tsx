import React, { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import EyeIcon from '../../assets/eye.svg'; 
import EyeCloseIcon from '../../assets/eyeClose.svg';
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, registration, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div>
      <label className="text-[13px] font-medium text-slate-700">{label}</label>
      
      <div className="relative">
        <input
          {...registration}
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition focus:ring-4 focus:ring-blue-500/10 outline-none 
            ${isPassword ? 'pr-11' : ''} 
            ${error ? 'border-red-500' : 'border-slate-200 focus:border-[#0f62fe]'} ${props.className || ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? (
              <img src={EyeIcon} alt="Hide" className="h-5 w-5" />
            ) : (
             <img src={EyeCloseIcon} alt="Hide" className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
};