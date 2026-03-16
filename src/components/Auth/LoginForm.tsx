import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <form onSubmit={handleLoginSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none uppercase ${loginErrors.username ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                        }`}
                    placeholder="E.G. AMITH1"
                    {...registerLogin("username", {
                        onChange: (e) => {
                            e.target.value = e.target.value.toUpperCase();
                        }
                    })}
                />
                {loginErrors.username && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.username.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                    type="password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${loginErrors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                        }`}
                    placeholder="••••••••"
                    {...registerLogin("password")}
                />
                {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.password.message}</p>
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
                    'Continue'
                )}
            </button>
        </form>
    );
};
