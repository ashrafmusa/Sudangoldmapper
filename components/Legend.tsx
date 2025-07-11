
import React from 'react';

export const Legend: React.FC = () => {
  const legendItems = [
    { color: 'bg-yellow-400', label: 'High Potential' },
    { color: 'bg-yellow-600', label: 'Medium Potential' },
    { color: 'bg-yellow-800', label: 'Low Potential' },
  ];

  return (
    <div>
      <h4 className="font-bold text-sm mb-2 text-gray-300">Potential Legend</h4>
      <div className="space-y-2">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center">
            <span className={`w-4 h-4 rounded-sm mr-2 ${item.color}`}></span>
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
