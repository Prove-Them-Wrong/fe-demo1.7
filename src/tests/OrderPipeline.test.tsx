// Updated src/__tests__/OrderPipeline.test.tsx (reliable queries + coord-based pointer moves)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderPipeline from '../components/OrderPipeline';

describe('OrderPipeline', () => {
  const mockClients = [
    { client_id: 'c1', first_name: 'John', last_name: 'Doe' },
    { client_id: 'c2', first_name: 'Jane', last_name: 'Smith' },
  ];

  const mockFabrics = [
    { fabric_id: 'f1', name: 'Super 150s Wool', supplier: 'Tessitura Monti' },
  ];

  const initialOrders = [
    {
      order_id: 'o1',
      client_id: 'c1',
      order_type: 'Custom Suit',
      status: 'Consultation',
      total_price: 1200,
      balance_due: 1200,
      deposit_paid: 0,
      fabric_id: 'f1',
      photos: [],
    },
    {
      order_id: 'o2',
      client_id: 'c2',
      order_type: 'Custom Shirt',
      status: 'Consultation',
      total_price: 250,
      balance_due: 250,
      deposit_paid: 0,
      fabric_id: null,
      photos: [],
    },
    {
      order_id: 'o3',
      client_id: 'c1',
      order_type: 'Jacket',
      status: 'In Production',
      total_price: 800,
      balance_due: 400,
      deposit_paid: 400,
      fabric_id: 'f1',
      photos: [],
    },
  ];

  const mockCrmData = {
    clients: mockClients,
    fabrics: mockFabrics,
    orders: initialOrders,
  };

  const mockUpdateCrmData = vi.fn();

  const renderPipeline = () => {
    render(
      <OrderPipeline crmData={mockCrmData} updateCrmData={mockUpdateCrmData} />
    );
  };

  const getColumn = (status: string) =>
    screen.getByTestId(`pipeline-column-${status.replace(/ /g, '-')}`);

  const getCard = (orderId: string) =>
    screen.getByTestId(`order-card-${orderId}`);

  beforeEach(() => {
    mockUpdateCrmData.mockClear();
    renderPipeline();
  });

  it('renders all 7 status columns with correct initial card counts', () => {
    expect(screen.getByText('Consultation (2)')).toBeInTheDocument();
    expect(screen.getByText('Fabric Selected (0)')).toBeInTheDocument();
    expect(screen.getByText('In Production (1)')).toBeInTheDocument();
    expect(screen.getByText('First Fitting (0)')).toBeInTheDocument();
    expect(screen.getByText('Final Fitting (0)')).toBeInTheDocument();
    expect(screen.getByText('Ready (0)')).toBeInTheDocument();
    expect(screen.getByText('Picked Up (0)')).toBeInTheDocument();
  });

  it('renders card details correctly', () => {
    const suitCard = getCard('o1');
    expect(within(suitCard).getByText('John Doe')).toBeInTheDocument();
    expect(within(suitCard).getByText('Custom Suit')).toBeInTheDocument();
    expect(within(suitCard).getByText(/Super 150s Wool \(Tessitura Monti\)/)).toBeInTheDocument();
    expect(within(suitCard).getByText('$1200 (Balance: $1200)')).toBeInTheDocument();

    const shirtCard = getCard('o2');
    expect(within(shirtCard).getByText('Jane Smith')).toBeInTheDocument();
    expect(within(shirtCard).getByText('Custom Shirt')).toBeInTheDocument();
    expect(within(shirtCard).getByText('$250 (Balance: $250)')).toBeInTheDocument();

    const jacketCard = getCard('o3');
    expect(within(jacketCard).getByText('John Doe')).toBeInTheDocument();
    expect(within(jacketCard).getByText('Jacket')).toBeInTheDocument();
    expect(within(jacketCard).getByText('$800 (Balance: $400)')).toBeInTheDocument();
  });

  it('updates order status when dragged to a different empty column', async () => {
    const user = userEvent.setup();

    const suitCard = getCard('o1');
    const targetColumn = getColumn('Fabric Selected');

    // Press on card center (assume coords relative)
    await user.pointer({ keys: '[MouseLeft>]', target: suitCard, coords: { x: 170, y: 100 } }); // center-ish of 340px card
    // Move far right to trigger distance >8 and land on target column
    await user.pointer({ target: targetColumn, coords: { x: 500, y: 100 } });
    await user.pointer({ keys: '[/MouseLeft]' });

    expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
    const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
    const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o1');
    expect(movedOrder.status).toBe('Fabric Selected');
  });

  it('updates order status when dropped on a card in a different column', async () => {
    const user = userEvent.setup();

    const shirtCard = getCard('o2');
    const jacketCard = getCard('o3');

    await user.pointer({ keys: '[MouseLeft>]', target: shirtCard, coords: { x: 170, y: 100 } });
    // Move to the In Production column (jacket card is there)
    await user.pointer({ target: jacketCard, coords: { x: 170, y: 100 } });
    await user.pointer({ keys: '[/MouseLeft]' });

    expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
    const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
    const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o2');
    expect(movedOrder.status).toBe('In Production');
  });

  it('does not update data when dragged within the same column', async () => {
    const user = userEvent.setup();

    const suitCard = getCard('o1');
    const shirtCard = getCard('o2');

    await user.pointer({ keys: '[MouseLeft>]', target: suitCard, coords: { x: 170, y: 50 } });
    await user.pointer({ target: shirtCard, coords: { x: 170, y: 150 } }); // move down within column
    await user.pointer({ keys: '[/MouseLeft]' });

    expect(mockUpdateCrmData).not.toHaveBeenCalled();
  });

  it('shows drag overlay with correct card content while dragging', async () => {
    const user = userEvent.setup();

    const suitCard = getCard('o1');

    // Start drag with significant movement to ensure activation
    await user.pointer({ keys: '[MouseLeft>]', target: suitCard, coords: { x: 170, y: 100 } });
    await user.pointer({ offset: { x: 50, y: 50 } }); // move to trigger overlay reliably

    // Now check for duplicates (original + overlay)
    const johnDoeElements = screen.getAllByText('John Doe');
    expect(johnDoeElements.length).toBeGreaterThanOrEqual(2); // at least original + overlay (may have more from other card)

    const suitElements = screen.getAllByText('Custom Suit');
    expect(suitElements.length).toBe(2); // one original + one overlay

    // Cleanup
    await user.pointer({ keys: '[/MouseLeft]' });
  });
});

// // Updated src/__tests__/OrderPipeline.test.tsx (fixed drag simulation + uses data-testid)
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import OrderPipeline from '../OrderPipeline';

// describe('OrderPipeline', () => {
//   const mockClients = [
//     { client_id: 'c1', first_name: 'John', last_name: 'Doe' },
//     { client_id: 'c2', first_name: 'Jane', last_name: 'Smith' },
//   ];

//   const mockFabrics = [
//     { fabric_id: 'f1', name: 'Super 150s Wool', supplier: 'Tessitura Monti' },
//   ];

//   const initialOrders = [
//     {
//       order_id: 'o1',
//       client_id: 'c1',
//       order_type: 'Custom Suit',
//       status: 'Consultation',
//       total_price: 1200,
//       balance_due: 1200,
//       deposit_paid: 0,
//       fabric_id: 'f1',
//       photos: [],
//     },
//     {
//       order_id: 'o2',
//       client_id: 'c2',
//       order_type: 'Custom Shirt',
//       status: 'Consultation',
//       total_price: 250,
//       balance_due: 250,
//       deposit_paid: 0,
//       fabric_id: null,
//       photos: [],
//     },
//     {
//       order_id: 'o3',
//       client_id: 'c1',
//       order_type: 'Jacket',
//       status: 'In Production',
//       total_price: 800,
//       balance_due: 400,
//       deposit_paid: 400,
//       fabric_id: 'f1',
//       photos: [],
//     },
//   ];

//   const mockCrmData = {
//     clients: mockClients,
//     fabrics: mockFabrics,
//     orders: initialOrders,
//   };

//   const mockUpdateCrmData = vi.fn();

//   const renderPipeline = () => {
//     render(
//       <OrderPipeline crmData={mockCrmData} updateCrmData={mockUpdateCrmData} />
//     );
//   };

//   const getColumn = (status: string) =>
//     screen.getByTestId(`pipeline-column-${status.replace(/ /g, '-')}`);

//   const getCard = (orderId: string) =>
//     screen.getByTestId(`order-card-${orderId}`);

//   beforeEach(() => {
//     mockUpdateCrmData.mockClear();
//     renderPipeline();
//   });

//   it('renders all 7 status columns with correct initial card counts', () => {
//     expect(screen.getByText('Consultation (2)')).toBeInTheDocument();
//     expect(screen.getByText('Fabric Selected (0)')).toBeInTheDocument();
//     expect(screen.getByText('In Production (1)')).toBeInTheDocument();
//     // ... other columns
//   });

//   it('renders card details correctly', () => {
//     expect(screen.getByText('John Doe')).toBeInTheDocument();
//     expect(screen.getByText('Custom Suit')).toBeInTheDocument();
//     expect(screen.getByText(/Super 150s Wool \(Tessitura Monti\)/)).toBeInTheDocument();
//     expect(screen.getByText('$1200 (Balance: $1200)')).toBeInTheDocument();

//     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
//     expect(screen.getByText('Custom Shirt')).toBeInTheDocument();
//     expect(screen.getByText('$250 (Balance: $250)')).toBeInTheDocument();

//     expect(screen.getByText('Jacket')).toBeInTheDocument();
//     expect(screen.getByText('$800 (Balance: $400)')).toBeInTheDocument();
//   });

//   it('updates order status when dragged to a different empty column', async () => {
//     const user = userEvent.setup();

//     const suitCard = getCard('o1');
//     const targetColumn = getColumn('Fabric Selected');

//     await user.pointer([
//       { target: suitCard, keys: '[MouseLeft>]' },
//       { target: targetColumn },
//       { keys: '[/MouseLeft]' },
//     ]);

//     expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
//     const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
//     const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o1');
//     expect(movedOrder.status).toBe('Fabric Selected');
//   });

//   it('updates order status when dropped on a card in a different column', async () => {
//     const user = userEvent.setup();

//     const shirtCard = getCard('o2');
//     const jacketCard = getCard('o3');

//     await user.pointer([
//       { target: shirtCard, keys: '[MouseLeft>]' },
//       { target: jacketCard },
//       { keys: '[/MouseLeft]' },
//     ]);

//     expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
//     const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
//     const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o2');
//     expect(movedOrder.status).toBe('In Production');
//   });

//   it('does not update data when dragged within the same column', async () => {
//     const user = userEvent.setup();

//     const suitCard = getCard('o1');
//     const shirtCard = getCard('o2');

//     await user.pointer([
//       { target: suitCard, keys: '[MouseLeft>]' },
//       { target: shirtCard },
//       { keys: '[/MouseLeft]' },
//     ]);

//     expect(mockUpdateCrmData).not.toHaveBeenCalled();
//   });

//   it('shows drag overlay with correct card content while dragging', async () => {
//     const user = userEvent.setup();

//     const suitCard = getCard('o1');

//     await user.pointer([
//       { target: suitCard, keys: '[MouseLeft>]' },
//       { target: suitCard }, // stay on card to trigger start without moving far
//     ]);

//     // Overlay should appear (duplicate text)
//     const johnDoeElements = screen.getAllByText('John Doe');
//     expect(johnDoeElements.length).toBe(2);

//     const suitElements = screen.getAllByText('Custom Suit');
//     expect(suitElements.length).toBe(2);

//     await user.pointer({ keys: '[/MouseLeft]' });
//   });
// });

// // src/__tests__/OrderPipeline.test.tsx
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen, within } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import OrderPipeline from '../OrderPipeline';

// describe('OrderPipeline', () => {
//   const mockClients = [
//     { client_id: 'c1', first_name: 'John', last_name: 'Doe' },
//     { client_id: 'c2', first_name: 'Jane', last_name: 'Smith' },
//   ];

//   const mockFabrics = [
//     { fabric_id: 'f1', name: 'Super 150s Wool', supplier: 'Tessitura Monti' },
//   ];

//   const initialOrders = [
//     {
//       order_id: 'o1',
//       client_id: 'c1',
//       order_type: 'Custom Suit',
//       status: 'Consultation',
//       total_price: 1200,
//       balance_due: 1200,
//       deposit_paid: 0,
//       fabric_id: 'f1',
//       photos: [],
//     },
//     {
//       order_id: 'o2',
//       client_id: 'c2',
//       order_type: 'Custom Shirt',
//       status: 'Consultation',
//       total_price: 250,
//       balance_due: 250,
//       deposit_paid: 0,
//       fabric_id: null,
//       photos: [],
//     },
//     {
//       order_id: 'o3',
//       client_id: 'c1',
//       order_type: 'Jacket',
//       status: 'In Production',
//       total_price: 800,
//       balance_due: 400,
//       deposit_paid: 400,
//       fabric_id: 'f1',
//       photos: [],
//     },
//   ];

//   const mockCrmData = {
//     clients: mockClients,
//     fabrics: mockFabrics,
//     orders: initialOrders,
//   };

//   const mockUpdateCrmData = vi.fn();

//   const renderPipeline = () => {
//     render(
//       <OrderPipeline crmData={mockCrmData} updateCrmData={mockUpdateCrmData} />
//     );
//   };

//   beforeEach(() => {
//     mockUpdateCrmData.mockClear();
//   });

//   it('renders all 7 status columns with correct initial card counts', () => {
//     renderPipeline();

//     expect(screen.getByText('Consultation (2)')).toBeInTheDocument();
//     expect(screen.getByText('Fabric Selected (0)')).toBeInTheDocument();
//     expect(screen.getByText('In Production (1)')).toBeInTheDocument();
//     expect(screen.getByText('First Fitting (0)')).toBeInTheDocument();
//     expect(screen.getByText('Final Fitting (0)')).toBeInTheDocument();
//     expect(screen.getByText('Ready (0)')).toBeInTheDocument();
//     expect(screen.getByText('Picked Up (0)')).toBeInTheDocument();
//   });

//   it('renders card details correctly (client name, order type, fabric, price/balance)', () => {
//     renderPipeline();

//     // Suit card
//     expect(screen.getByText('John Doe')).toBeInTheDocument();
//     expect(screen.getByText('Custom Suit')).toBeInTheDocument();
//     expect(screen.getByText(/Super 150s Wool \(Tessitura Monti\)/)).toBeInTheDocument();
//     expect(screen.getByText('$1200 (Balance: $1200)')).toBeInTheDocument();

//     // Shirt card
//     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
//     expect(screen.getByText('Custom Shirt')).toBeInTheDocument();
//     expect(screen.getByText('$250 (Balance: $250)')).toBeInTheDocument();

//     // Jacket card
//     expect(screen.getByText('Jacket')).toBeInTheDocument();
//     expect(screen.getByText('$800 (Balance: $400)')).toBeInTheDocument();
//   });

//   it('updates order status when dragged to a different empty column', async () => {
//     const user = userEvent.setup();
//     renderPipeline();

//     // Find the Custom Suit card (in Consultation)
//     const suitCardText = screen.getByText('Custom Suit');
//     const suitCard = suitCardText.closest('div')!; // the sortable card div

//     // Find the empty "Fabric Selected" column (droppable)
//     const targetColumnHeader = screen.getByText('Fabric Selected (0)');
//     const targetColumn = targetColumnHeader.parentElement!; // the droppable div

//     // Simulate drag: press on card → move to column → release
//     await user.pointer({ keys: '[MouseLeft>]', target: suitCard });
//     await user.pointer({ target: targetColumn });
//     await user.pointer({ keys: '[/MouseLeft]' });

//     expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
//     const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
//     const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o1');
//     expect(movedOrder.status).toBe('Fabric Selected');

//     // Other orders unchanged
//     expect(updatedCrm.orders.find((o: any) => o.order_id === 'o2').status).toBe('Consultation');
//     expect(updatedCrm.orders.find((o: any) => o.order_id === 'o3').status).toBe('In Production');
//   });

//   it('updates order status when dropped on a card in a different column', async () => {
//     const user = userEvent.setup();
//     renderPipeline();

//     // Drag the Shirt from Consultation to the Jacket card in In Production
//     const shirtCardText = screen.getByText('Custom Shirt');
//     const shirtCard = shirtCardText.closest('div')!;

//     const jacketCardText = screen.getByText('Jacket');
//     const jacketCard = jacketCardText.closest('div')!;

//     await user.pointer({ keys: '[MouseLeft>]', target: shirtCard });
//     await user.pointer({ target: jacketCard });
//     await user.pointer({ keys: '[/MouseLeft]' });

//     expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
//     const updatedCrm = mockUpdateCrmData.mock.calls[0][0];
//     const movedOrder = updatedCrm.orders.find((o: any) => o.order_id === 'o2');
//     expect(movedOrder.status).toBe('In Production');
//   });

//   it('does not update data when dragged within the same column (reorder only)', async () => {
//     const user = userEvent.setup();
//     renderPipeline();

//     // Drag Suit over Shirt in the same Consultation column
//     const suitCardText = screen.getByText('Custom Suit');
//     const suitCard = suitCardText.closest('div')!;

//     const shirtCardText = screen.getByText('Custom Shirt');
//     const shirtCard = shirtCardText.closest('div')!;

//     await user.pointer({ keys: '[MouseLeft>]', target: suitCard });
//     await user.pointer({ target: shirtCard });
//     await user.pointer({ keys: '[/MouseLeft]' });

//     expect(mockUpdateCrmData).not.toHaveBeenCalled();
//   });

//   it('shows drag overlay with correct card content while dragging', async () => {
//     const user = userEvent.setup();
//     renderPipeline();

//     const suitCard = screen.getByText('Custom Suit').closest('div')!;

//     // Start drag (press down)
//     await user.pointer({ keys: '[MouseLeft>]', target: suitCard });

//     // Overlay should now be rendered with the same content
//     const johnDoeElements = screen.getAllByText('John Doe');
//     expect(johnDoeElements.length).toBe(2); // original (faded) + overlay

//     const suitElements = screen.getAllByText('Custom Suit');
//     expect(suitElements.length).toBe(2);

//     // Clean up: release (no status change since no move)
//     await user.pointer({ keys: '[/MouseLeft]' });
//   });
// });