import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
  it('allows admin login', () => {
    const mockLogin = vi.fn();
    render(
      <MemoryRouter>
        <Login onLogin={mockLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'adminpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(mockLogin).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
  });

  it('shows error for invalid credentials', () => {
    render(<Login onLogin={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});