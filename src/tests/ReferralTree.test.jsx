import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReferralTree from '../components/ReferralTree';

const mockData = {
  clients: [
    { client_id: '1', first_name: 'Root', last_name: 'User', referred_by_id: null },
    { client_id: '2', first_name: 'Referred', last_name: 'Client', referred_by_id: '1' }
  ],
  orders: [{ client_id: '1', total_price: 1000 }]
};

describe('ReferralTree', () => {
  it('renders referral hierarchy', () => {
    render(<ReferralTree crmData={mockData} />);
    expect(screen.getByText(/Root User/i)).toBeInTheDocument();
    expect(screen.getByText(/Referred Client/i)).toBeInTheDocument();
  });
});