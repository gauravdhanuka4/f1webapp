"use client";

import React from 'react';
import { VictoryChart, VictoryAxis, VictoryBoxPlot, VictoryGroup } from 'victory';
import * as d3 from 'd3-shape';

interface ViolinPlotProps {
  data: any;
}

const ViolinPlot: React.FC<ViolinPlotProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available to display.</p>
      </div>
    );
  }

  return (
    <VictoryChart>
      <VictoryGroup>
        {data.drivers.map((driver: any) => (
          <VictoryBoxPlot
            key={driver.name}
            data={driver.lapTimes.map((lapTime: number) => ({ x: driver.name, y: lapTime }))}
            boxWidth={20}
            style={{
              min: { stroke: driver.color },
              max: { stroke: driver.color },
              q1: { fill: driver.color },
              q3: { fill: driver.color },
              median: { stroke: 'white', strokeWidth: 2 },
            }}
          />
        ))}
      </VictoryGroup>
      <VictoryAxis dependentAxis label="Lap Time (s)" />
      <VictoryAxis label="Driver" />
    </VictoryChart>
  );
};

export default ViolinPlot;
