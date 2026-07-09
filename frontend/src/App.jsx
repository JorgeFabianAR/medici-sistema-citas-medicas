import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Verificando conexión...');
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/health')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('No se pudo conectar con la API'));

    fetch('http://localhost:3000/api/pacientes')
      .then((response) => response.json())
      .then((data) => setPacientes(data.data || []))
      .catch(() => setPacientes([]));

    fetch('http://localhost:3000/api/especialidades')
      .then((response) => response.json())
      .then((data) => setEspecialidades(data.data || []))
      .catch(() => setEspecialidades([]));

    fetch('http://localhost:3000/api/medicos')
      .then((response) => response.json())
      .then((data) => setMedicos(data.data || []))
      .catch(() => setMedicos([]));

    fetch('http://localhost:3000/api/consultorios')
      .then((response) => response.json())
      .then((data) => setConsultorios(data.data || []))
      .catch(() => setConsultorios([]));
  }, []);

  return (
    <main style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>MediCI</h1>
      <h2>Sistema inteligente de agendamiento automático de citas médicas</h2>

      <p>
        <strong>Estado de conexión con API:</strong> {apiStatus}
      </p>

      <hr />

      <h2>Dashboard inicial</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Pacientes</h3>
          <p>Total: {pacientes.length}</p>
        </section>

        <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Especialidades</h3>
          <p>Total: {especialidades.length}</p>
        </section>

        <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Médicos</h3>
          <p>Total: {medicos.length}</p>
        </section>

        <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Consultorios</h3>
          <p>Total: {consultorios.length}</p>
        </section>
      </div>

      <hr />

      <h2>Especialidades disponibles</h2>
      <ul>
        {especialidades.map((especialidad) => (
          <li key={especialidad.id_especialidad}>
            {especialidad.nombre} - {especialidad.descripcion}
          </li>
        ))}
      </ul>

      <h2>Médicos registrados</h2>
      <ul>
        {medicos.map((medico) => (
          <li key={medico.id_medico}>
            Dr(a). {medico.nombre} {medico.apellido_paterno} - Cédula: {medico.cedula_profesional}
          </li>
        ))}
      </ul>

      <h2>Consultorios</h2>
      <ul>
        {consultorios.map((consultorio) => (
          <li key={consultorio.id_consultorio}>
            {consultorio.nombre} - {consultorio.ubicacion}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;