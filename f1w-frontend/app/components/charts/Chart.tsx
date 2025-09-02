"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar';
  data: any;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ type, data, className }) => {
  if (!data) {
    return (
      <div className={`flex items-center justify-center h-full text-gray-500 ${className}`}>
        <p>No data available to display.</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data.drivers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lap" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.drivers.map((driver: any) => (
              <Line
                key={driver.code}
                type="monotone"
                dataKey="lapTime"
                stroke={driver.color}
                name={driver.name}
                dot={false}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data.teams}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lapTimes.median" fill="#8884d8" name="Median Lap Time" />
          </BarChart>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Invalid chart type specified.</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
