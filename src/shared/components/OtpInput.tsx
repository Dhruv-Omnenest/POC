import React, { useState, useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  error?: string;
  value: string;
  onChange: (val: string) => void;
  onResend?: () => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 4, error, value, onChange, onResend }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // In the browser, the interval ID is just a number
    let intervalId: number;

    if (timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    if (onResend) onResend();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length).replace(/[^0-9]/g, '');
    onChange(data);
    const nextIndex = data.length < length ? data.length : length - 1;
    inputs.current[nextIndex]?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const newValue = value.split('');
    newValue[index] = val.substring(val.length - 1);
    const finalValue = newValue.join('');
    onChange(finalValue);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={`h-12 w-12 rounded-lg border text-center text-lg font-bold outline-none transition focus:ring-4 focus:ring-blue-500/10 
              ${error ? 'border-red-500' : 'border-slate-200 focus:border-[#0f62fe]'}`}
          />
        ))}
      </div>

      <div className="flex flex-col items-end min-h-10">
        {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}
        
        {!canResend ? (
          <p className="text-xs text-slate-500">
            Resend OTP in <span className="font-semibold text-slate-700">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-xs font-semibold text-[#0f62fe] hover:text-[#0b57df] transition underline underline-offset-4"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};