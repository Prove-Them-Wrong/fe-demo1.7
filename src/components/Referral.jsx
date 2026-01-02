import React, { useState } from 'react';

const Referral = ({ user, setUser }) => {
  const [code, setCode] = useState(`REF-${user.email.split('@')[0]}`); // Simulated code
  const [credits, setCredits] = useState(user.credits || 0);

  const simulateReferral = () => {
    const newCredits = credits + 5; // Simulate earning
    const updatedUser = { ...user, credits: newCredits };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCredits(newCredits);
  };

  return (
    <div>
      <h2>Referral System</h2>
      <p>Share your code with friends to earn credits!</p>
      <p>Your Referral Code: {code}</p>
      <p>Current Credits: {credits}</p>
      <button onClick={simulateReferral}>Simulate Friend Referral (Demo)</button>
    </div>
  );
};

export default Referral;