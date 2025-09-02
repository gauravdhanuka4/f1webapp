import React from 'react';
import { render, screen } from '@testing-library/react';
import Chart from './Chart';

describe('Chart component', () => {
  it('renders a message when no data is provided', () => {
    render(<Chart type="line" data={null} />);
    expect(screen.getByText('No data available to display.')).toBeInTheDocument();
  });

  it('renders a line chart when type is "line"', () => {
    const mockData = {
      drivers: [
        { code: 'VER', name: 'Max Verstappen', color: '#3671C6', lapTime: 88.1, lap: 1 },
        { code: 'HAM', name: 'Lewis Hamilton', color: '#00D2BE', lapTime: 88.2, lap: 1 },
      ],
    };
    render(<Chart type="line" data={mockData} />);
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
  });

  it('renders a bar chart when type is "bar"', () => {
    const mockData = {
      teams: [
        { name: 'Red Bull Racing', lapTimes: { median: 88.5 } },
        { name: 'Mercedes', lapTimes: { median: 89.0 } },
      ],
    };
    render(<Chart type="bar" data={mockData} />);
    expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
  });

  it('renders an error message for invalid chart type', () => {
    render(<Chart type={"pie" as any} data={{}} />);
    expect(screen.getByText('Invalid chart type specified.')).toBeInTheDocument();
  });
});
