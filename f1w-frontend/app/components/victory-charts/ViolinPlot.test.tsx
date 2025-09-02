import React from 'react';
import { render, screen } from '@testing-library/react';
import ViolinPlot from './ViolinPlot';

describe('ViolinPlot component', () => {
  it('renders a message when no data is provided', () => {
    render(<ViolinPlot data={null} />);
    expect(screen.getByText('No data available to display.')).toBeInTheDocument();
  });

  it('renders a violin plot when data is provided', () => {
    const mockData = {
      drivers: [
        { name: 'VER', lapTimes: [88.1, 88.2, 88.0] },
        { name: 'HAM', lapTimes: [88.2, 88.3, 88.1] },
      ],
    };
    render(<ViolinPlot data={mockData} />);
    expect(screen.getByText('Lap Time (s)')).toBeInTheDocument();
    expect(screen.getByText('Driver')).toBeInTheDocument();
  });
});
