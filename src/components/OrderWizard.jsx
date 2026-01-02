// OrderWizard.jsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialCrmData } from '../data/crmData';

const steps = [
  'Client & Type',
  'Measurements Snapshot',
  'Fabric, Specs & Details',
  'Pricing & Photos',
];

const OrderWizard = ({ crmData, updateCrmData, onClose }) => {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState({
    client_id: '',
    order_type: '',
    status: 'Consultation',
    fabric_id: '',
    specificationsString: '{}',
    total_price: 0,
    deposit_paid: 0,
    balance_due: 0,
    financing_type: 'None',
    due_date: '',
    event_date: '',
    photosString: '',
    measurements: {},
  });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
  console.log('Order state re-rendered with:', { client_id: order.client_id, order_type: order.order_type });
}, [order]);

  // Unified handleChange — handles all field updates safely
//   const handleChange = (field, value) => {
//     setOrder(prev => ({
//       ...prev,
//       [field]:
//         field === 'total_price' || field === 'deposit_paid'
//           ? Number(value) || 0
//           : value,
//     }));
//   };
const handleChange = (field, value) => {
  console.log(`handleChange called for ${field} with value:`, value, 'type:', typeof value);
  setOrder(prev => {
    const newVal = field === 'total_price' || field === 'deposit_paid'
      ? Number(value) || 0
      : value;
    console.log(`Setting ${field} to:`, newVal);
    return {
      ...prev,
      [field]: newVal,
    };
  });
};
  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const validateStep = () => {
    setError('');
    if (step === 0 && (!order.client_id || !order.order_type)) {
      setError('Select client and order type.');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    setError('');
    let specifications = {};
    try {
      specifications = JSON.parse(order.specificationsString || '{}');
    } catch (e) {
      setError('Invalid JSON in specifications.');
      return;
    }

    if (!order.client_id || !order.order_type || order.total_price <= 0) {
      setError('Missing required fields: client, type, or price.');
      return;
    }

    const newOrder = {
      ...order,
      order_id: uuidv4(),
      fabric_id: order.fabric_id || null,
      specifications,
      balance_due: order.total_price - order.deposit_paid,
      due_date: order.due_date || new Date().toISOString().split('T')[0],
      photos: order.photosString
        ? order.photosString.split(',').map(url => url.trim())
        : [],
    };

    const newData = { ...crmData, orders: [...crmData.orders, newOrder] };
    updateCrmData(newData);

    let notif = '';
    if (order.status === 'First Fitting')
      notif = 'Notification: Order ready for fitting!';
    else if (order.status === 'Ready')
      notif = 'Notification: Order ready for pickup!';
    if (notif) setNotification(notif);

    onClose();
  };

  const snapshotMeasurements = () => {
    const clientMeasurements =
      crmData.measurements?.find(m => m.client_id === order.client_id) || {};
    setOrder(prev => ({
      ...prev,
      measurements: { ...clientMeasurements },
    }));
    alert('Measurements snapshot taken!');
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    background: 'white',
    cursor: 'pointer',
  };

  // Safety: Ensure crmData is valid before proceeding
  if (!crmData) {
    return <div className="card" style={{ padding: '20px' }}>Loading...</div>;
  }

  // Defensive extraction with fallbacks
  const clients = Array.isArray(crmData.clients) ? crmData.clients : [];

  const fabrics = Array.isArray(crmData.fabrics)
    ? crmData.fabrics
    : initialCrmData.fabrics || [];
 
  return (
    // Full-screen backdrop (semi-transparent, captures clicks outside to close)
  <div
    style={{
      position: 'fixed',
      inset: 0,  // top/right/bottom/left: 0 — full screen
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onClick={onClose}  // Click outside modal → close
  >
    // Inner modal card (stops click from bubbling to backdrop)
    <div
      className="card"
      style={{
        position: 'relative',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        pointerEvents: 'auto',  // Explicitly ensure events work
      }}
      onClick={(e) => e.stopPropagation()}  // Prevent clicks inside from closing
    >
      {/* Optional close X button in corner */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      <h3>Create Order – Step {step + 1}: {steps[step]}</h3>

      {/* DIAGNOSTIC - keep for now */}
      <p><strong>Debug State:</strong></p>
      <p>Current client_id: "{order.client_id || 'EMPTY'}" (length: {String(order.client_id).length})</p>
      <p>Current order_type: "{order.order_type || 'EMPTY'}"</p>
      <p>Number of clients available: {crmData?.clients?.length ?? 0}</p>
      <p>Number of fabrics available: {fabrics.length}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notification && <p style={{ color: 'green' }}>{notification}</p>}

      {/* Step 0: Client, Type, Status */}
      {step === 0 && (
        <>
          {/* Client Select - now controlled */}
    <div style={{ marginBottom: '15px' }}>
      <label>Client:</label>
      <select
        value={order.client_id}
  onChange={(e) => {
    console.log('CLIENT SELECT onChange fired – raw e.target.value:', e.target.value);
    handleChange('client_id', e.target.value);
  }}
  style={selectStyle}
>
        <option value="">Select Client</option>
{clients.length === 0 ? (
  <option disabled>No clients available – create one first</option>
) : (
  clients.map((c) => (
    <option key={c.client_id} value={c.client_id}>
      {c.first_name} {c.last_name}
    </option>
  ))
)}
      </select>
    </div>

      <div style={{ marginBottom: '15px' }}>
      <label>Order Type:</label>
      <select
        value={order.order_type}
  onChange={(e) => {
    console.log('ORDER TYPE SELECT onChange fired – raw e.target.value:', e.target.value);
    handleChange('order_type', e.target.value);
  }}
  style={selectStyle}
>
        <option value="">Select Order Type</option>
        <option value="Custom Suit">Custom Suit</option>
        <option value="Custom Shirt">Custom Shirt</option>
        <option value="Alteration">Alteration</option>
        <option value="Accessory">Accessory</option>
      </select>
    </div>

          <select
            style={selectStyle}
            value={order.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="Consultation">Consultation (Default)</option>
            <option value="Fabric Selected">Fabric Selected</option>
            <option value="In Production">In Production</option>
            <option value="First Fitting">First Fitting</option>
            <option value="Final Fitting">Final Fitting</option>
            <option value="Ready">Ready</option>
            <option value="Picked Up">Picked Up</option>
          </select>
        
        </>
      )}

      {/* Step 1: Measurements Snapshot */}
      {step === 1 && order.client_id && (
        <div>
          <p>Current client measurements (snapshot below):</p>
          <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
            {Object.keys(order.measurements).length > 0
              ? JSON.stringify(order.measurements, null, 2)
              : 'No measurements found for this client.'}
          </pre>
          <button
            onClick={snapshotMeasurements}
            className="btn-primary"
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Take Snapshot
          </button>
        </div>
      )}

      {/* Step 2: Fabric, Specs, Dates, Financing */}
      {step === 2 && (
        <>
          <select
            style={selectStyle}
            value={order.fabric_id}
            onChange={(e) => handleChange('fabric_id', e.target.value)}
          >
            <option value="">Select Fabric</option>
            {fabrics.map((f) => (
              <option key={f.fabric_id} value={f.fabric_id}>
                {f.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder='Specifications (JSON format, e.g., {"buttons": "Mother of Pearl"})'
            value={order.specificationsString}
            onChange={(e) => handleChange('specificationsString', e.target.value)}
            rows={5}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <input
            type="date"
            value={order.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <input
            type="date"
            placeholder="Event Date (optional)"
            value={order.event_date}
            onChange={(e) => handleChange('event_date', e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <select
            style={selectStyle}
            value={order.financing_type}
            onChange={(e) => handleChange('financing_type', e.target.value)}
          >
            <option value="None">None</option>
            <option value="Affirm">Affirm</option>
            <option value="PayPal">PayPal</option>
            <option value="House Account">House Account</option>
          </select>
        </>
      )}

      {/* Step 3: Pricing & Photos */}
      {step === 3 && (
        <>
          <input
            type="number"
            placeholder="Total Price"
            value={order.total_price || ''}
            onChange={(e) => handleChange('total_price', e.target.value)}
            min="0"
            step="0.01"
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <input
            type="number"
            placeholder="Deposit Paid"
            value={order.deposit_paid || ''}
            onChange={(e) => handleChange('deposit_paid', e.target.value)}
            min="0"
            step="0.01"
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <input
            placeholder="Photo URLs (comma separated, e.g., url1,url2)"
            value={order.photosString}
            onChange={(e) => handleChange('photosString', e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />
        </>
      )}

     {/* Navigation Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        {step > 0 && <button onClick={prevStep} className="btn-secondary">Back</button>}
        {step < steps.length - 1 ? (
          <button onClick={nextStep} className="btn-primary">Next</button>
        ) : (
          <button onClick={handleSave} className="btn-primary">Create Order</button>
        )}
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
  );
};

export default OrderWizard;
