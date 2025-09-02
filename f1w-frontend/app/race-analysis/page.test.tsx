import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import RaceAnalysisPage from './page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: { races: [], drivers: [] } }),
  })
) as jest.Mock;

describe('RaceAnalysisPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders the page header and initial components', async () => {
    await act(async () => {
      render(<RaceAnalysisPage />);
    });
    expect(screen.getByText('F1 Race Analysis')).toBeInTheDocument();
    expect(screen.getByText('Select Data to Analyze')).toBeInTheDocument();
  });

  it('fetches initial data on load', async () => {
    await act(async () => {
      render(<RaceAnalysisPage />);
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('fetches race pace data when the form is submitted', async () => {
    await act(async () => {
      render(<RaceAnalysisPage />);
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Load Data'));
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
