import React from 'react';

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>AI Evaluator for Technical Diagrams</h1>
      <p>Welcome! Upload your technical diagram to get instant AI feedback.</p>

      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Upload feature coming soon!')}
      >
        Upload Diagram
      </button>
    </div>
  );
}

export default App;