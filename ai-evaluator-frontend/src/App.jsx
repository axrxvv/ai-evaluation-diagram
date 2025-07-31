import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import './App.css'

function App() {
  const [feedback, setFeedback] = useState('');
  const [tab, setTab] = useState('upload');
  const [description, setDescription] = useState('');
  const canvasRef = useRef(null);

  const submitDrawing = async () => {
    try {
      const dataUrl = await canvasRef.current.exportImage('png');
      const blob = await fetch(dataUrl).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'drawing.png');
      formData.append('description', description);
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
    formData.append('description', description);
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
        backgroundColor: '#ffffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Berribot Logo in Top-Left */}
      <img
        src="/berribot.jpeg"
        alt="Berribot Logo"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          height: '40px',
        }}
      />

      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0a9586', textAlign: 'center' }}>
        AI Evaluator for Technical Diagrams
      </h1>
      <p style={{ maxWidth: '1200px', textAlign: 'center', margin: '1rem 0', color: '#7d7d7eff' }}>
        Upload your technical diagram or draw it directly to get instant AI-powered feedback and suggestions for improvement.
      </p>

      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', borderRadius: '8px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)', overflow: 'hidden', marginBottom: '30px' }}>
        <button
          onClick={() => setTab('upload')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: tab === 'upload' ? '#06685eff' : '#0a9586',
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
            backgroundColor: tab === 'draw' ? '#06685eff' : '#0a9586',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Draw Diagram
        </button>
      </div>

      <div style={{ backgroundColor: '#ffffffff', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '1200px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)', marginBottom: '30px', textAlign: 'center' }}>
        {tab === 'upload' && (
          <form onSubmit={submitImage}>
            <input type="file" accept="image/*" style={{ marginBottom: '10px', border: '1px solid #0a9586', color: '#0a9586', borderRadius: '20px' }} />
            <br />
            <textarea
              placeholder="Describe the diagram (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                marginTop: '10px',
                borderRadius: '8px',
                padding: '10px',
                border: '1px solid #0a9586',
                backgroundColor: '#ffffffff',
                color: '#7d7d7eff'
              }}
            />
            <br />
            <button
              type="submit"
              style={{ padding: '10px 20px', backgroundColor: '#0a9586', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
            >
              Upload and Analyze
            </button>
          </form>
        )}

        {tab === 'draw' && (
          <>
            <h2 style={{ marginBottom: '20px', color: '#0a9586' }}>Draw your diagram</h2>
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={2}
              strokeColor="#0a9586"
              canvasColor="#faf5f5ff"
              width="100%"
              height="300px"
              style={{ border: '1px dashed #444', borderRadius: '8px' }}
            />
            <textarea
              placeholder="Describe the diagram (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                marginTop: '20px',
                borderRadius: '8px',
                padding: '10px',
                border: '1px solid #444',
                backgroundColor: '#ffffffff',
                color: '#7d7d7eff'
              }}
            />
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={submitDrawing}
                style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#0a9586', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Submit Drawing
              </button>
              <button
                onClick={() => canvasRef.current.clearCanvas()}
                style={{ padding: '10px 20px', backgroundColor: '#8b0707ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
