import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TelemetryPage from './page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: { races: [], sessions: [], drivers: [] } }),
  })
) as jest.Mock;

describe('TelemetryPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders the page header and initial components', async () => {
    await act(async () => {
      render(<TelemetryPage />);
    });
    expect(screen.getByText('F1 Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Select Telemetry Data')).toBeInTheDocument();
  });

  it('fetches initial data on load', async () => {
    await act(async () => {
      render(<TelemetryPage />);
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('fetches telemetry data when the form is submitted', async () => {
    await act(async () => {
      render(<TelemetryPage />);
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Load Data'));
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
  });
});
