import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactSketchCanvas } from 'react-sketch-canvas';

function App() {
  const [feedback, setFeedback] = useState('');
  const [tab, setTab] = useState('upload');
  const canvasRef = useRef(null);

  const submitDrawing = async () => {
    try {
      const dataUrl = await canvasRef.current.exportImage('png');
      const blob = await fetch(dataUrl).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'drawing.png');
      const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      alert('Canvas submitted successfully!');
      setFeedback(data.feedback);
    } catch {
      alert('Canvas upload failed!');
      setFeedback('');
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const file = e.target.elements[0].files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert('File uploaded successfully!');
        setFeedback(data.feedback);
      })
      .catch(() => {
        alert('File upload failed!');
        setFeedback('');
      });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0e0e0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa', textAlign: 'center' }}>
        AI Evaluator for Technical Diagrams
      </h1>
      <p style={{ maxWidth: '1200px', textAlign: 'center', margin: '1rem 0', color: '#d1d5db' }}>
        Upload your technical diagram or draw it directly to get instant AI-powered feedback and suggestions for improvement.
      </p>

      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', backgroundColor: '#1f2937', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
        <button
          onClick={() => setTab('upload')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: tab === 'upload' ? '#111827' : '#1f2937',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Upload Image
        </button>
        <button
          onClick={() => setTab('draw')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: tab === 'draw' ? '#111827' : '#1f2937',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Draw Diagram
        </button>
      </div>

      <div style={{ backgroundColor: '#111827', padding: '40px 20px', borderRadius: '10px', width: '100%', maxWidth: '1200px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)', marginBottom: '30px', textAlign: 'center' }}>
        {tab === 'upload' && (
          <form onSubmit={submitImage}>
            <input type="file" accept="image/*" style={{ marginBottom: '10px' }} />
            <br />
            <button
              type="submit"
              style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
            >
              Upload and Analyze
            </button>
          </form>
        )}

        {tab === 'draw' && (
          <>
            <h2 style={{ marginBottom: '20px', color: '#93c5fd' }}>Draw your diagram</h2>
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={2}
              strokeColor="white"
              canvasColor="#1a1a1a"
              width="100%"
              height="300px"
              style={{ border: '1px dashed #444', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={submitDrawing}
                style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Submit Drawing
              </button>
              <button
                onClick={() => canvasRef.current.clearCanvas()}
                style={{ padding: '10px 20px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Clear Canvas
              </button>
            </div>
          </>
        )}
      </div>

      {feedback && (
        <div
          style={{
            padding: '30px',
            backgroundColor: '#1f2937',
            color: '#fff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '60vh',
            overflowY: 'auto',
            textAlign: 'left',
            fontSize: '1rem'
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#93c5fd' }}>AI Feedback:</h3>
          <ReactMarkdown>{feedback}</ReactMarkdown>
          <button
            onClick={() => setFeedback('')}
            style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Clear Feedback
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
