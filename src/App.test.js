import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Product CRUD App header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Product CRUD App/i);
  expect(headerElement).toBeInTheDocument();
});

