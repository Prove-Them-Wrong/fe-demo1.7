// New file: src/CreateAppointment.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const appointmentTypes = ['Consultation', 'Fitting', 'Pickup'];
const durations = { Consultation: 60, Fitting: 30, Pickup: 15 };

const CreateAppointment = ({ crmData, updateCrmData, onClose, editingAppointment = null }) => {
  const isEdit = !!editingAppointment;

  const [formData, setFormData] = useState({
    client_id: editingAppointment?.client_id || '',
    type: editingAppointment?.type || 'Consultation',
    start_time: editingAppointment ? editingAppointment.start_time.slice(0, 16) : '', // datetime-local format
    notes: editingAppointment?.notes || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isBusinessHours = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) return false;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours >= 10 && (hours < 18 || (hours === 18 && minutes <= 30));
  };

  const hasOverlap = (startStr, durationMin, ignoreId = null) => {
    const newStart = new Date(startStr);
    const newEnd = new Date(newStart.getTime() + durationMin * 60000);

    return crmData.appointments.some((appt) => {
      if (appt.appointment_id === ignoreId) return false;
      const existingStart = new Date(appt.start_time);
      const existingEnd = new Date(existingStart.getTime() + appt.duration_minutes * 60000);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  // Fixed src/CreateAppointment.jsx (replace the handleSubmit function's appointment update logic)

const handleSubmit = () => {
  setError('');

  if (!formData.client_id || !formData.type || !formData.start_time) {
    setError('Please fill all required fields.');
    return;
  }

  if (!isBusinessHours(formData.start_time)) {
    setError('Appointments only available Mon–Fri, 10:00 AM – 6:30 PM.');
    return;
  }

  const duration = durations[formData.type];
  const ignoreId = isEdit ? editingAppointment.appointment_id : null;
  if (hasOverlap(formData.start_time, duration, ignoreId)) {
    setError('This time conflicts with an existing appointment.');
    return;
  }

  const appointmentData = {
    appointment_id: isEdit ? editingAppointment.appointment_id : uuidv4(),
    client_id: formData.client_id,
    type: formData.type,
    start_time: new Date(formData.start_time).toISOString(),
    duration_minutes: duration,
    status: isEdit ? editingAppointment.status : 'Scheduled',
    notes: formData.notes,
  };

  // Safely handle possibly undefined appointments array
  let newAppointments = crmData.appointments || [];

  if (isEdit) {
    newAppointments = newAppointments.map((a) =>
      a.appointment_id === appointmentData.appointment_id ? appointmentData : a
    );
  } else {
    newAppointments = [...newAppointments, appointmentData];
  }

  let newData = { ...crmData, appointments: newAppointments };

  // Add activity log only on creation
  if (!isEdit) {
    const newActivity = {
      activity_id: uuidv4(),
      client_id: formData.client_id,
      created_at: new Date().toISOString(),
      activity_type: 'Appointment Scheduled',
      subject: `${formData.type} on ${new Date(formData.start_time).toLocaleString()}`,
    };
    newData = {
      ...newData,
      activities: [...(crmData.activities || []), newActivity],
    };
  }

  updateCrmData(newData);
  onClose();
};

  return (
    <div className="u-card-modal">
      <h3>{isEdit ? 'Edit' : 'New'} Appointment</h3>

      <div className="u-mb-15">
        <label htmlFor="client-select">Client</label>
        <select
          id="client-select"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          className="u-form-control"
        >
          <option value="">Select Client</option>
          {crmData.clients.map((c) => (
            <option key={c.client_id} value={c.client_id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="u-mb-15">
        <label htmlFor="type-select">Type (Duration)</label>
        <select
          id="type-select"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="u-form-control"
        >
          {appointmentTypes.map((t) => (
            <option key={t} value={t}>
              {t} ({durations[t]} min)
            </option>
          ))}
        </select>
      </div>

      <div className="u-mb-15">
        <label htmlFor="datetime-input">Date & Time</label>
        <input
          id="datetime-input"
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="u-form-control"
        />
      </div>

      <div className="u-mb-15">
        <label htmlFor="notes-textarea">Notes (optional)</label>
        <textarea
          id="notes-textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="u-form-control"
          style={{ height: 80 }}
        />
      </div>

      {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={handleSubmit} className="btn-primary">
          {isEdit ? 'Save Changes' : 'Schedule'}
        </button>
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateAppointment;