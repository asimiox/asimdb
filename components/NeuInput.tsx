import React from 'react';

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const NeuInput: React.FC<NeuInputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-500 transition-colors">
          {icon}
        </div>
        <input
          className={`
            w-full bg-[#212529] text-gray-200 rounded-xl py-4 pl-12 pr-4
            shadow-[inset_5px_5px_10px_#16181b,inset_-5px_-5px_10px_#2c3237]
            outline-none border-none
            focus:shadow-[inset_6px_6px_12px_#121416,inset_-6px_-6px_12px_#30363c]
            focus:text-cyan-400
            placeholder-gray-600
            transition-all duration-300
            font-mono tracking-wide
            text-lg
          `}
          {...props}
        />
        {/* Subtle glow effect on focus */}
        <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_0_1px_rgba(6,182,212,0)] group-focus-within:shadow-[0_0_0_1px_rgba(6,182,212,0.1)] transition-all duration-300"></div>
      </div>
      {error && <span className="text-red-500 text-xs ml-1 font-mono">{error}</span>}
    </div>
  );
};

export default NeuInput;