import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-2 uppercase font-bold text-lg transition-all active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-2";
  
  // Monochrome B&W Variants
  const variants = {
    primary: "border-white text-white hover:bg-white hover:text-black shadow-[0_0_5px_rgba(255,255,255,0.3)]",
    secondary: "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-black",
    danger: "border-white text-white hover:bg-white hover:text-black" // Keeping simple for B&W theme, maybe just text indicator
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'LOADING...' : children}
      {/* Decorative corners for pixel look */}
      <div className="absolute top-[-4px] left-[-4px] w-1 h-1 bg-current"></div>
      <div className="absolute top-[-4px] right-[-4px] w-1 h-1 bg-current"></div>
      <div className="absolute bottom-[-4px] left-[-4px] w-1 h-1 bg-current"></div>
      <div className="absolute bottom-[-4px] right-[-4px] w-1 h-1 bg-current"></div>
    </button>
  );
};

export default PixelButton;