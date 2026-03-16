import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpFormData } from '../../schemas/auth.schema';

interface OtpFormProps {
    onSubmit: (data: OtpFormData) => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
}

export const OtpForm: React.FC<OtpFormProps> = ({ onSubmit, onBack, isLoading }) => {
    const {
        register: registerOtp,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    return (
        <form onSubmit={handleOtpSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 text-center">One-Time Password</label>

                {/* HIDDEN DUMMY INPUTS TO ABSORB CHROME AUTOFILL */}
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

                <input
                    type="text"
                    id="otp-input-field"
                    maxLength={4}
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-center text-2xl tracking-[1em] font-mono ${otpErrors.otp ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                        }`}
                    autoFocus
                    {...registerOtp("otp", {
                        onChange: (e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                        }
                    })}
                />
                {otpErrors.otp && (
                    <p className="mt-2 text-sm text-red-500 text-center">{otpErrors.otp.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50"
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                        Processing...
                    </span>
                ) : (
                    'Verify & Login'
                )}
            </button>

            <button
                type="button"
                onClick={onBack}
                className="w-full text-sm text-slate-500 hover:text-blue-600 transition"
            >
                Back to credentials
            </button>
        </form>
    );
};
