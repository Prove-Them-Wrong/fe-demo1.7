import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ClientProfile from '../components/ClientProfile';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockCrmData = {
  clients: [{ client_id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', vip_status: true }],
  measurements: [{ client_id: '1', chest: 42.5 }],
  style_preferences: [{ client_id: '1', fit_preference: 'Slim' }],
  orders: [{ client_id: '1', order_type: 'Custom Suit', total_price: 1500 }],
  activities: [{ client_id: '1', activity_type: 'Note Added', subject: 'Test', created_at: '2025-01-01' }]
};

describe('ClientProfile', () => {
  it('displays client details', () => {
    render(
      <MemoryRouter initialEntries={['/admin-crm/client/1']}>
         <Routes>
          <Route path="/admin-crm/client/:id" element={<ClientProfile crmData={mockCrmData} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP/i)).toBeInTheDocument();
    expect(screen.getByText(/chest/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom Suit/i)).toBeInTheDocument();
  });

  it('shows not found for invalid id', () => {
    render(
      <MemoryRouter initialEntries={['/admin-crm/client/999']}>
        <Routes>
          <Route path="/admin-crm/client/:id" element={<ClientProfile crmData={mockCrmData} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Client not found/i)).toBeInTheDocument();
  });
});