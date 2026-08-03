import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EV Charging Station title', () => {
  render(<App />);
  expect(screen.getByText(/EV Charging Station/i)).toBeInTheDocument();
});
