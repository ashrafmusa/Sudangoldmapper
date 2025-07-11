import React from 'react';

const MapLegend: React.FC = () => {
  const legendItems = [
    { color: 'bg-yellow-400', label: 'High Potential' },
    { color: 'bg-yellow-600', label: 'Medium Potential' },
    { color: 'bg-yellow-800', label: 'Low Potential' },
  ];

  return (
    <div
      className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-md text-white text-xs p-3 border border-gray-600 w-48"
      style={{ zIndex: 1000 }}
    >
      <div className="font-bold text-yellow-400 mb-2 text-sm">Gold Potential</div>
      <div className="flex flex-col gap-1.5">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center">
            <span className={`inline-block w-4 h-4 rounded-sm mr-2 ${item.color}`} />
            <span className="text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
