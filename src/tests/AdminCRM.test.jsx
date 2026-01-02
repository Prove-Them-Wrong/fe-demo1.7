import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminCRM from '../components/AdminCRM';
import { MemoryRouter } from 'react-router-dom';

const mockCrmData = {
  clients: [
    { client_id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '123' }
  ]
};

const mockUpdate = vi.fn();

describe('AdminCRM', () => {
  it('renders search and buttons', () => {
    render(
      <MemoryRouter>
        <AdminCRM crmData={mockCrmData} updateCrmData={mockUpdate} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Search by name, email, or phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Client/i)).toBeInTheDocument();
  });

  it('shows search suggestions', () => {
    render(
      <MemoryRouter>
        <AdminCRM crmData={mockCrmData} updateCrmData={mockUpdate} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'john' } });
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});