import React from 'react';
import { ChartData } from '../types';

interface BarChartProps {
  data: ChartData;
  yAxisLabel?: string;
  barColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, yAxisLabel = '', barColor = 'bg-blue-500' }) => {
  const maxValue = Math.max(...data.data, 0);
  
  return (
    <div className="w-full h-full flex flex-col bg-white p-4 rounded-lg">
      <div className="flex-grow flex items-end gap-2 sm:gap-4">
        {data.data.map((value, index) => (
          <div key={data.labels[index]} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative group w-full h-full flex items-end">
              <div
                className={`w-full ${barColor} rounded-t-md transition-all duration-300 hover:opacity-80`}
                style={{ height: `${(value / (maxValue * 1.1)) * 100}%` }}
              >
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 text-white text-xs rounded py-1 px-2">
                    {yAxisLabel}{value}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500">{data.labels[index]}</span>
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-200 mt-2"></div>
    </div>
  );
};

export default BarChart;