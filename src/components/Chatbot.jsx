import React, { useState } from 'react';

// Hard-coded examples
const responses = {
  'what are your return policies?': 'Returns are accepted within 30 days for store credit.',
  'how do i measure for tailoring?': 'Use our sizing guide: chest, waist, etc.',
  'shipping time?': 'Standard shipping takes 5-7 days.',
  default: 'Sorry, I can only answer a few questions. Contact support for more.'
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { text: input, from: 'user' }]);
    const reply = responses[input.toLowerCase()] || responses.default;
    setMessages((prev) => [...prev, { text: reply, from: 'bot' }]);
    setInput('');
  };

  return (
    <div className="u-fixed-chatbot">
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: 0 }}>Chatbot</h3>
        <div style={{ height: 200, overflowY: 'auto', marginTop: 8 }}>
          {messages.map((msg, idx) => (
            <p key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '6px 0' }}>{msg.text}</p>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input className="u-form-control" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." />
          <button onClick={handleSend} className="btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;