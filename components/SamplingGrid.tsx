import React from 'react';

export const SamplingGrid: React.FC = () => {
  const gridCells = Array.from({ length: 15 * 10 }); // 15 columns, 10 rows

  return (
    <div className="absolute inset-0 grid grid-cols-15 grid-rows-10 pointer-events-none">
      {gridCells.map((_, index) => (
        <div
          key={index}
          className="border-r border-b border-white/10"
          style={{
            animation: `pulse-cell 4s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        ></div>
      ))}
    </div>
  );
};
