import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setVisible(true);

    const timer = setTimeout(() => {
      // Animate out
      setVisible(false);
      // Unmount after animation
      const unmountTimer = setTimeout(onClose, 300); // Corresponds to transition duration
      return () => clearTimeout(unmountTimer);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 text-white py-3 px-6 rounded-full shadow-lg z-50 transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};
