import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
  };
});

describe('App', () => {
  it('renders navbar and home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/TailorChic/i)).toBeInTheDocument();
    expect(screen.getByText(/Fashion & Professional Tailoring/i)).toBeInTheDocument();
  });
});