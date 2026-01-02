import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Add uuid via npm install uuid
import CreateClient from './CreateClient';
import MergeClients from './MergeClients';
import ReferralTree from './ReferralTree';
import OrderWizard from './OrderWizard';
import OrderPipeline from './OrderPipeline';
// import { initialCrmData } from './crmData';
import CreateAppointment from './CreateAppointment';



const AdminCRM = ({ crmData, updateCrmData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = crmData.clients.filter(client =>
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleMarkStatus = (apptId, newStatus, isNoShow = false) => {
    const updatedAppointments = crmData.appointments.map((a) =>
      a.appointment_id === apptId ? { ...a, status: newStatus } : a
    );

    let newData = { ...crmData, appointments: updatedAppointments };

    if (isNoShow) {
      const appt = crmData.appointments.find((a) => a.appointment_id === apptId);
      const updatedClients = crmData.clients.map((c) =>
        c.client_id === appt.client_id ? { ...c, no_show_count: (c.no_show_count || 0) + 1 } : c
      );
      newData = { ...newData, clients: updatedClients };
    }

    updateCrmData(newData);
  };

  
// Safely get appointments with guards
  const appointments = crmData.appointments || [];
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'Scheduled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const todayStr = new Date().toISOString().slice(0, 10); // e.g., '2025-12-22'
  const todaysAppointments = upcomingAppointments.filter((a) =>
    a.start_time.startsWith(todayStr)
  );
  if (!crmData || !crmData.clients) {
  return <div>Loading CRM data...</div>;
}

  return (
    <div className="container">
      <h2>Admin CRM Dashboard</h2>
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input u-form-control u-mb-15"
      />
      {suggestions.length > 0 && (
        <ul className="u-card" style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {suggestions.map(client => (
            <li key={client.client_id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <Link to={`/admin-crm/client/${client.client_id}`}>{client.first_name} {client.last_name} ({client.email})</Link>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
        <button onClick={() => setShowCreate(true)} className="btn-primary">Create New Client</button>
        <button onClick={() => setShowMerge(true)} className="btn-primary">Merge Clients</button>
      </div>
      {showCreate && <CreateClient crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowCreate(false)} />}
      {showMerge && <MergeClients crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowMerge(false)} />}
      <h3>Referral Network Visualization</h3>
      <ReferralTree crmData={crmData} />
  
<button onClick={() => setShowWizard(true)} className="btn-primary">New Order (Wizard)</button>
{showWizard && <OrderWizard crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowWizard(false)} />}
<h2>Order Pipeline (Kanban)</h2>
<OrderPipeline crmData={crmData} updateCrmData={updateCrmData} />

      <div style={{ margin: '20px 0' }}>
        <button
          onClick={() => {
            setEditingAppointment(null);
            setShowAppointment(true);
          }}
          className="btn-primary"
        >
          New Appointment
        </button>
      </div>

      <h2>Today's Appointments ({todaysAppointments.length})</h2>
      {todaysAppointments.length === 0 ? (
        <p>No appointments today.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todaysAppointments.map((appt) => {
            const client = crmData.clients.find((c) => c.client_id === appt.client_id);
            const time = new Date(appt.start_time).toLocaleString();
            return (
              <li key={appt.appointment_id} className="card u-mb-15">
                  <strong>{time}</strong> – {client?.first_name} {client?.last_name} – {appt.type}
                  <br />
                  {appt.notes && <em>{appt.notes}</em>}
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => {
                        setEditingAppointment(appt);
                        setShowAppointment(true);
                      }}
                      className="btn-secondary"
                      style={{ marginRight: '8px' }}
                    >
                      Edit/Reschedule
                    </button>
                    <button className="btn-secondary" onClick={() => handleMarkStatus(appt.appointment_id, 'Completed')}>
                      Mark Completed
                    </button>
                    <button className="btn-secondary" onClick={() => handleMarkStatus(appt.appointment_id, 'No-show', true)} style={{ marginLeft: '8px', color: 'red' }}>
                      Mark No-Show
                    </button>
                  </div>
                </li>
            );
          })}
        </ul>
      )}

      <h2>Upcoming Appointments</h2>
      {/* Similar list as above for all upcoming */}

      {showAppointment && (
        <CreateAppointment
          crmData={crmData}
          updateCrmData={updateCrmData}
          onClose={() => setShowAppointment(false)}
          editingAppointment={editingAppointment}
        />
      )}

    </div>
  );
};

// Hard-coded customers for demo
// const initialCustomers = [
//   { id: 1, email: 'customer1@example.com', credits: 10, notes: 'Loyal customer' },
//   { id: 2, email: 'customer2@example.com', credits: 5, notes: '' },
// ];

// const AdminCRM = () => {
//   const [customers, setCustomers] = useState(initialCustomers);
//   const [notes, setNotes] = useState({});

//   const handleNoteChange = (id, note) => {
//     setNotes({ ...notes, [id]: note });
//   };

//   const saveNote = (id) => {
//     const updated = customers.map(c => c.id === id ? { ...c, notes: notes[id] } : c);
//     setCustomers(updated);
//   };

//   return (
//     <div>
//       <h2>Admin CRM Dashboard</h2>
//       <table>
//         <thead>
//           <tr><th>Email</th><th>Credits</th><th>Notes</th><th>Action</th></tr>
//         </thead>
//         <tbody>
//           {customers.map((cust) => (
//             <tr key={cust.id}>
//               <td>{cust.email}</td>
//               <td>{cust.credits}</td>
//               <td>
//                 <input
//                   value={notes[cust.id] || cust.notes}
//                   onChange={(e) => handleNoteChange(cust.id, e.target.value)}
//                 />
//               </td>
//               <td><button onClick={() => saveNote(cust.id)}>Save</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default AdminCRM;