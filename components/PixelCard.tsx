import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'white'; // Deprecated prop kept for compatibility but ignored
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = '' }) => {
  // Always B&W style
  const styleClass = 'box-glow border-white text-white bg-black';

  return (
    <div className={`relative border-2 p-6 ${styleClass} ${className}`}>
       {children}
       {/* Corner accents */}
       <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
       <div className="absolute top-0 right-0 w-2 h-2 bg-white"></div>
       <div className="absolute bottom-0 left-0 w-2 h-2 bg-white"></div>
       <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
    </div>
  );
};

export default PixelCard;