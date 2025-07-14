import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [feedback, setFeedback] = useState('');

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ textAlign: 'center', color: 'white', maxWidth: '90%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          AI Evaluator for Technical Diagrams
        </h1>
        <p style={{ marginBottom: '1rem' }}>
          Welcome! Upload your technical diagram to get instant AI feedback.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const file = e.target.elements[0].files[0];
            if (file) {
              const formData = new FormData();
              formData.append('file', file);
              fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  alert('File uploaded successfully!');
                  setFeedback(data.feedback);
                })
                .catch((error) => {
                  alert('File upload failed!');
                  setFeedback('');
                });
            }
          }}
        >
          <input type="file" accept="image/*" style={{ marginBottom: '10px' }} />
          <br />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Upload
          </button>
        </form>
      </div>

      {feedback && (
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#2b2b2b',
            color: '#fff',
            borderRadius: '8px',
            maxWidth: '600px',
            textAlign: 'left',
            fontSize: '1rem',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>AI Feedback:</h3>
          <ReactMarkdown>{feedback}</ReactMarkdown>
          <button
            onClick={() => setFeedback('')}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Clear Feedback
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
