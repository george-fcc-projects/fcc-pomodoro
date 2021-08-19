import { render, screen } from '@testing-library/react';
import Pomodoro from './Pomodoro';

test('renders learn react link', () => {
  render(<Pomodoro />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
