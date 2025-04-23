import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import io from 'socket.io-client';

const socket = io('https://your-app-name.up.railway.app');

function App() {
  const [code, setCode] = useState('');
  const [docId] = useState('default-doc');
  const docIdRef = useRef(docId);

  useEffect(() => {
    socket.emit('join', docIdRef.current);
    socket.on('change', (newCode) => {
      if (newCode !== code) setCode(newCode);
    });
    socket.on('load', (initialContent) => {
      setCode(initialContent);
    });
    return () => {
      socket.off('change');
      socket.off('load');
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit('change', value, docIdRef.current);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Collaborative Code Editor</h1>
      <CodeMirror
        value={code}
        height="500px"
        extensions={[javascript()]}
        onChange={handleChange}
      />
      <p>Open this in another browser to see real-time collaboration!</p>
    </div>
  );
}

export default App;