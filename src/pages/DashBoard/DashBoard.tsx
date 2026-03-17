import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store"




export const DashBoard: React.FC = () => {
    const {executeLogout}=useAuthStore();
     const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to Dashboard</h1>

            <button
            onClick={()=>{
                executeLogout();
                 navigate('/auth', { replace: true });
            }}
                type="submit"
                className="w-full rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200 disabled:text-slate-500"
            >
                LogOut
            </button>
        </div>
    )
}

