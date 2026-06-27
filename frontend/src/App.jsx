import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Verificando conexión...');

  useEffect(() => {
    fetch('http://localhost:3000/api/health')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('No se pudo conectar con la API'));
  }, []);

  return (
    <main style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>MediCI</h1>
      <h2>Sistema inteligente de agendamiento automático de citas médicas</h2>
      <p>
        <strong>Estado de conexión con API:</strong> {apiStatus}
      </p>
    </main>
  );
}

export default App;