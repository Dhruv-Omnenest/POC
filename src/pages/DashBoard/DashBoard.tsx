import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/hooks/useAuth"; 

export const DashBoard: React.FC = () => {

    const { handleLogout, isLoading } = useAuth();
    const navigate = useNavigate();

    const onLogoutClick = async () => {
        try {
            await handleLogout()
            navigate('/auth', { replace: true });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>

            <button
                onClick={onLogoutClick}
                disabled={isLoading}
                type="button" 
                className="w-full max-w-xs rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200 disabled:text-slate-400"
            >
                {isLoading ? "Logging out..." : "Log Out"}
            </button>
        </div>
    );
};