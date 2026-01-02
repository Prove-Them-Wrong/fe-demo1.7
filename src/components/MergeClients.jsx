import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MergeClients = ({ crmData, updateCrmData, onClose }) => {
  const [client1Id, setClient1Id] = useState('');
  const [client2Id, setClient2Id] = useState('');

  const handleMerge = () => {
    const client1 = crmData.clients.find(c => c.client_id === client1Id);
    const client2 = crmData.clients.find(c => c.client_id === client2Id);
    if (!client1 || !client2) return;

    // Merge: Keep client1, append histories from client2
    const mergedClient = { ...client1, notes: `${client1.notes}\nMerged from ${client2.first_name} ${client2.last_name}: ${client2.notes}` };
    const newClients = crmData.clients.filter(c => c.client_id !== client2Id);

    // Update references (e.g., referred_by_id)
    newClients.forEach(c => { if (c.referred_by_id === client2Id) c.referred_by_id = client1Id; });

    // Append measurements, preferences (take latest), orders, activities
    const newMeasurements = [...crmData.measurements.filter(m => m.client_id !== client2Id), { ...crmData.measurements.find(m => m.client_id === client2Id), client_id: client1Id }];
    const newPreferences = [...crmData.style_preferences.filter(p => p.client_id !== client2Id), { ...crmData.style_preferences.find(p => p.client_id === client2Id), client_id: client1Id }];
    const newOrders = [...crmData.orders, ...crmData.orders.filter(o => o.client_id === client2Id).map(o => ({ ...o, client_id: client1Id }))];
    const newActivities = [...crmData.activities, ...crmData.activities.filter(a => a.client_id === client2Id).map(a => ({ ...a, client_id: client1Id }))];

    const newData = {
      ...crmData,
      clients: newClients.map(c => c.client_id === client1Id ? mergedClient : c),
      measurements: newMeasurements,
      style_preferences: newPreferences,
      orders: newOrders,
      activities: newActivities
    };
    updateCrmData(newData);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: '20%', left: '30%', background: 'white', padding: '20px', border: '1px solid #ccc', zIndex: 1000 }}>
      <h3>Merge Clients</h3>
      <select onChange={(e) => setClient1Id(e.target.value)}>
        <option value="">Select Client 1 (Keep)</option>
        {crmData.clients.map(c => <option key={c.client_id} value={c.client_id}>{c.first_name} {c.last_name}</option>)}
      </select>
      <select onChange={(e) => setClient2Id(e.target.value)}>
        <option value="">Select Client 2 (Merge Into 1)</option>
        {crmData.clients.map(c => <option key={c.client_id} value={c.client_id}>{c.first_name} {c.last_name}</option>)}
      </select>
      <button onClick={handleMerge} className="btn-primary">Merge</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default MergeClients;