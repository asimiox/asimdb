import React from 'react';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'default';
  icon?: React.ReactNode;
  loading?: boolean;
}

const NeuButton: React.FC<NeuButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'default', 
  icon,
  loading,
  disabled,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden transition-all duration-300 ease-out active:scale-95 flex items-center justify-center gap-2 font-bold tracking-wider rounded-xl select-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#212529]";
  
  const variants = {
    default: "bg-[#212529] text-gray-400 shadow-[6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] hover:text-cyan-400 hover:shadow-[8px_8px_16px_#16181b,-8px_-8px_16px_#2c3237] active:shadow-[inset_4px_4px_8px_#16181b,inset_-4px_-4px_8px_#2c3237]",
    primary: "bg-[#212529] text-cyan-500 shadow-[6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3),6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] active:shadow-[inset_4px_4px_8px_#16181b,inset_-4px_-4px_8px_#2c3237]",
    danger: "bg-[#212529] text-red-500 shadow-[6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3),6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] active:shadow-[inset_4px_4px_8px_#16181b,inset_-4px_-4px_8px_#2c3237]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon}
      {children}
    </button>
  );
};

export default NeuButton;