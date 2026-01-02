import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CreateClient = ({ crmData, updateCrmData, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', // ... other fields default to spec
    address: { street: '', city: '', state: '', zip: '' },
    referral_source: 'Other', referred_by_id: null, vip_status: false, communication_pref: 'Email', notes: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const duplicateEmail = crmData.clients.find(c => c.email === formData.email);
    const duplicatePhone = crmData.clients.find(c => c.phone === formData.phone);
    if (duplicateEmail || duplicatePhone) {
      setError('Duplicate email or phone detected!');
      return;
    }
    const newClient = { ...formData, client_id: uuidv4() };
    const newData = { ...crmData, clients: [...crmData.clients, newClient] };
    updateCrmData(newData);
    onClose();
  };

  return (
    <div className="u-card-modal" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <h3>Create Client</h3>
      <div className="u-grid-2 u-mb-15">
        <input name="first_name" placeholder="First Name" onChange={handleChange} className="u-form-control" />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} className="u-form-control" />
      </div>
      <div className="u-grid-2 u-mb-15">
        <input name="email" placeholder="Email" onChange={handleChange} className="u-form-control" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="u-form-control" />
      </div>
      {/* Add more inputs for address, etc. */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={handleSubmit} className="btn-primary">Create</button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateClient;