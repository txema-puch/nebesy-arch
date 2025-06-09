import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './index.css';

function Box({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function Viewer({ geometry }) {
  return (
    <Canvas style={{ height: '300px', background: '#eee' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {geometry.map((g, i) => (
        <Box key={i} position={g.position} size={g.size} />
      ))}
    </Canvas>
  );
}

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const send = async () => {
    const res = await fetch('/api/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setResult(data);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <textarea className="w-full border p-2" rows="4" value={text} onChange={e => setText(e.target.value)} placeholder="Describe tu idea" />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={send}>Enviar</button>
      {result && (
        <div className="space-y-4">
          <Viewer geometry={result.geometry} />
          <table className="table-auto border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th>Parámetro</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Tipo solución</td><td>{result.design.solution_type}</td></tr>
              <tr><td>Área (m²)</td><td>{result.design.area_m2}</td></tr>
              <tr><td>Retención (mm)</td><td>{result.design.water_retention_mm}</td></tr>
              <tr><td>CO₂ capturado (kg)</td><td>{result.design.co2_capture_kg}</td></tr>
            </tbody>
          </table>
          <button className="bg-green-600 text-white px-4 py-2" onClick={download}>Exportar JSON</button>
        </div>
      )}
    </div>
  );
}

export default App;
