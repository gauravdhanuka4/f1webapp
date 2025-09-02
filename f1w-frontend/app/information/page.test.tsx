import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InformationPage from './page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: { standings: [], races: [] } }),
  })
) as jest.Mock;

describe('InformationPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders the page header and initial components', () => {
    render(<InformationPage />);
    expect(screen.getByText('F1 Information')).toBeInTheDocument();
    expect(screen.getByText('Select Year')).toBeInTheDocument();
  });

  it('fetches data when the "Load Data" button is clicked', async () => {
    render(<InformationPage />);
    fireEvent.click(screen.getByText('Load Data'));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
  });
});
