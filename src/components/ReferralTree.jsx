import React from 'react';

const ReferralTree = ({ crmData }) => {
  if (!crmData || !crmData.clients) return <p>No referral data</p>;

  const getRevenue = (clientId) => {
    return crmData.orders
      .filter(o => o.client_id === clientId)
      .reduce((sum, o) => sum + (o.total_price || 0), 0);
  };

  const buildTree = (clientId, visited = new Set()) => {
    if (visited.has(clientId)) return null; // Prevent cycles
    visited.add(clientId);

    const client = crmData.clients.find(c => c.client_id === clientId);
    if (!client) return null;

    const directRevenue = getRevenue(clientId);
    const referrals = crmData.clients.filter(c => c.referred_by_id === clientId);

    return (
      <li key={clientId} style={{ marginLeft: '20px', marginBottom: '10px' }}>
        <strong>{client.first_name} {client.last_name}</strong> 
        {' '}– Direct: ${directRevenue} 
        {client.vip_status && <span style={{ color: '#e91e63' }}> (VIP)</span>}
        {referrals.length > 0 && (
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {referrals.map(ref => buildTree(ref.client_id, new Set(visited)))}
          </ul>
        )}
      </li>
    );
  };

  const roots = crmData.clients.filter(c => !c.referred_by_id || c.referred_by_id === null);

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3>Referral Network</h3>
      {roots.length === 0 ? <p>No clients with referrals</p> : 
        <ul style={{ paddingLeft: '20px' }}>
          {roots.map(root => buildTree(root.client_id))}
        </ul>
      }
    </div>
  );
};

export default ReferralTree;


// import React from 'react';

// const ReferralTree = ({ crmData }) => {
//   const buildTree = (clientId, depth = 0) => {
//     const client = crmData.clients.find(c => c.client_id === clientId);
//     if (!client) return null;

//     const referrals = crmData.clients.filter(c => c.referred_by_id === clientId);
//     const revenue = crmData.orders.filter(o => o.client_id === clientId).reduce((sum, o) => sum + o.total_price, 0);
//     const subtreeRevenue = referrals.reduce((sum, ref) => sum + getSubtreeRevenue(ref.client_id), 0);

//     return (
//       <li key={clientId} style={{ marginLeft: `${depth * 20}px` }}>
//         {client.first_name} {client.last_name} (Direct Revenue: ${revenue}, Attributed: ${subtreeRevenue})
//         {referrals.length > 0 && <ul>{referrals.map(ref => buildTree(ref.client_id, depth + 1))}</ul>}
//       </li>
//     );
//   };

//   const getSubtreeRevenue = (clientId) => {
//     const referrals = crmData.clients.filter(c => c.referred_by_id === clientId);
//     const direct = crmData.orders.filter(o => o.client_id === clientId).reduce((sum, o) => sum + o.total_price, 0);
//     return direct + referrals.reduce((sum, ref) => sum + getSubtreeRevenue(ref.client_id), 0);
//   };

//   const roots = crmData.clients.filter(c => !c.referred_by_id);
//   return <ul>{roots.map(root => buildTree(root.client_id))}</ul>;
// };

// export default ReferralTree;