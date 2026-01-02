// src/__tests__/CreateAppointment.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateAppointment from '../components/CreateAppointment';

// Mock uuid to return predictable IDs
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}));

describe('CreateAppointment', () => {
  const mockOnClose = vi.fn();
  const mockUpdateCrmData = vi.fn();

  const baseCrmData = {
    clients: [
      { client_id: 'client-1', first_name: 'John', last_name: 'Doe' },
    ],
    appointments: [],
    activities: [],
  };

  const fillRequiredFields = (overrides = {}) => {
    fireEvent.change(screen.getByLabelText(/Client/i), {
      target: { value: overrides.client_id || 'client-1' },
    });
    if (overrides.type) {
      fireEvent.change(screen.getByLabelText(/Type/i), {
        target: { value: overrides.type },
      });
    }
    fireEvent.change(screen.getByLabelText(/Date & Time/i), {
      target: { value: overrides.dateTime || '2025-12-23T11:00' }, // Tuesday, inside hours
    });
    if (overrides.notes !== undefined) {
      fireEvent.change(screen.getByLabelText(/Notes/i), {
        target: { value: overrides.notes },
      });
    }
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders new appointment form correctly', () => {
    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByLabelText(/Client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date & Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
  });

  it('renders edit appointment form with pre-filled data', () => {
    const editingAppointment = {
      appointment_id: 'appt-123',
      client_id: 'client-1',
      type: 'Fitting',
      start_time: '2025-12-23T14:30:00.000Z',
      status: 'Scheduled',
      notes: 'Existing note',
    };

    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
        editingAppointment={editingAppointment}
      />
    );

    expect(screen.getByText('Edit Appointment')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByLabelText(/Client/i).value).toBe('client-1');
    expect(screen.getByLabelText(/Type/i).value).toBe('Fitting');
    expect(screen.getByLabelText(/Date & Time/i).value).toBe('2025-12-23T14:30');
    expect(screen.getByLabelText(/Notes/i).value).toBe('Existing note');
  });

  it('shows error when required fields are missing', () => {
    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Schedule'));

    expect(screen.getByText('Please fill all required fields.')).toBeInTheDocument();
  });

  it('shows error for weekend date', () => {
    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    fillRequiredFields({ dateTime: '2025-12-28T12:00' }); // Sunday

    fireEvent.click(screen.getByText('Schedule'));

    expect(
      screen.getByText('Appointments only available Mon–Fri, 10:00 AM – 6:30 PM.')
    ).toBeInTheDocument();
  });

  it('shows error for time outside business hours', () => {
    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    // Before 10:00 AM
    fillRequiredFields({ dateTime: '2025-12-23T09:00' });
    fireEvent.click(screen.getByText('Schedule'));
    expect(
      screen.getByText('Appointments only available Mon–Fri, 10:00 AM – 6:30 PM.')
    ).toBeInTheDocument();

    // After 18:30
    fireEvent.change(screen.getByLabelText(/Date & Time/i), {
      target: { value: '2025-12-23T19:00' },
    });
    fireEvent.click(screen.getByText('Schedule'));
    expect(
      screen.getByText('Appointments only available Mon–Fri, 10:00 AM – 6:30 PM.')
    ).toBeInTheDocument();
  });

  it('shows error when appointment overlaps with existing one', () => {
    const crmWithExisting = {
      ...baseCrmData,
      appointments: [
        {
          appointment_id: 'existing-1',
          start_time: '2025-12-23T11:00:00.000Z',
          duration_minutes: 60,
        },
      ],
    };

    render(
      <CreateAppointment
        crmData={crmWithExisting}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    fillRequiredFields({ dateTime: '2025-12-23T11:30' }); // Overlaps

    fireEvent.click(screen.getByText('Schedule'));

    expect(
      screen.getByText('This time conflicts with an existing appointment.')
    ).toBeInTheDocument();
  });

  it('successfully creates a new appointment and adds activity log', () => {
    render(
      <CreateAppointment
        crmData={baseCrmData}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
      />
    );

    fillRequiredFields({ dateTime: '2025-12-23T11:00', notes: 'Test note' });

    fireEvent.click(screen.getByText('Schedule'));

    expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
    const updatedData = mockUpdateCrmData.mock.calls[0][0];

    expect(updatedData.appointments).toHaveLength(1);
    const newAppt = updatedData.appointments[0];
    expect(newAppt.appointment_id).toBe('mock-uuid');
    expect(newAppt.client_id).toBe('client-1');
    expect(newAppt.type).toBe('Consultation');
    expect(newAppt.duration_minutes).toBe(60);
    expect(newAppt.status).toBe('Scheduled');
    expect(newAppt.notes).toBe('Test note');
    expect(newAppt.start_time).toMatch(/2025-12-23T11:00:00/); // ISO format

    expect(updatedData.activities).toHaveLength(1);
    expect(updatedData.activities[0].activity_type).toBe('Appointment Scheduled');
    expect(updatedData.activities[0].client_id).toBe('client-1');

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('successfully edits an existing appointment without adding activity', () => {
    const editingAppointment = {
      appointment_id: 'appt-123',
      client_id: 'client-1',
      type: 'Consultation',
      start_time: '2025-12-23T11:00:00.000Z',
      duration_minutes: 60,
      status: 'Scheduled',
      notes: 'Old note',
    };

    const crmWithAppt = {
      ...baseCrmData,
      appointments: [editingAppointment],
    };

    render(
      <CreateAppointment
        crmData={crmWithAppt}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
        editingAppointment={editingAppointment}
      />
    );

    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'Updated note' },
    });

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockUpdateCrmData).toHaveBeenCalledTimes(1);
    const updatedData = mockUpdateCrmData.mock.calls[0][0];

    expect(updatedData.appointments).toHaveLength(1);
    expect(updatedData.appointments[0].appointment_id).toBe('appt-123');
    expect(updatedData.appointments[0].notes).toBe('Updated note');
    // No new activity added
    expect(updatedData.activities).toBeUndefined();

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('ignores self-overlap when editing the same appointment', () => {
    const editingAppointment = {
      appointment_id: 'appt-123',
      client_id: 'client-1',
      type: 'Consultation',
      start_time: '2025-12-23T11:00:00.000Z',
      duration_minutes: 60,
      status: 'Scheduled',
    };

    const crmWithAppt = {
      ...baseCrmData,
      appointments: [editingAppointment],
    };

    render(
      <CreateAppointment
        crmData={crmWithAppt}
        updateCrmData={mockUpdateCrmData}
        onClose={mockOnClose}
        editingAppointment={editingAppointment}
      />
    );

    // Submit without changing time
    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockUpdateCrmData).toHaveBeenCalled();
    expect(screen.queryByText(/conflicts/)).not.toBeInTheDocument();
  });
});