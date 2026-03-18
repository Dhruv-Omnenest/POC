interface AuthStepWrapperProps {
  title: string;
  buttonText: string;
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  onSubmit: () => void; 
}

export const AuthStepWrapper: React.FC<AuthStepWrapperProps> = ({ 
  title, buttonText, isLoading, error, children, onSubmit 
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <h2 className="text-[15px] font-semibold text-[#2f2f2f] mb-6">{title}</h2>
    
    {children}

    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600 animate-in fade-in">
        {error}
      </div>
    )}

    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:bg-slate-200"
    >
      {isLoading ? "Processing..." : buttonText}
    </button>
  </form>
);