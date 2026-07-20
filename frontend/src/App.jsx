import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Verificando conexión...');
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const [formCita, setFormCita] = useState({
    id_paciente: '1',
    id_medico: '1',
    id_consultorio: '1',
    fecha: '2026-07-10',
    hora_inicio: '09:00',
    metodo_agendamiento: 'AUTOMATICO'
  });

  const cargarDatos = () => {
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

    fetch('http://localhost:3000/api/citas')
      .then((response) => response.json())
      .then((data) => setCitas(data.data || []))
      .catch(() => setCitas([]));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormCita({
      ...formCita,
      [name]: value
    });
  };

  const crearCita = async (event) => {
    event.preventDefault();
    setMensaje('Registrando cita...');

    try {
      const response = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formCita)
      });

      const data = await response.json();

      if (!response.ok) {
        const sugerencia = data.sugerencia
          ? ` Horario sugerido: ${data.sugerencia.hora_inicio} - ${data.sugerencia.hora_fin}`
          : ' No hay horario disponible.';

        setMensaje(`${data.message}.${sugerencia}`);
        return;
      }

      setMensaje(data.message);
      cargarDatos();
    } catch (error) {
      setMensaje('No se pudo conectar con el backend');
    }
  };

  return (
    <main style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>MediCI</h1>
      <h2>Sistema inteligente de agendamiento automático de citas médicas</h2>

      <p>
        <strong>Estado de conexión con API:</strong> {apiStatus}
      </p>

      <hr />

      <h2>Dashboard inicial</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
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

        <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Citas</h3>
          <p>Total: {citas.length}</p>
        </section>
      </div>

      <hr />

      <h2>Registro de cita médica</h2>

      <form onSubmit={crearCita} style={{ display: 'grid', gap: '12px', maxWidth: '500px' }}>
        <label>
          ID Paciente:
          <input
            type="number"
            name="id_paciente"
            value={formCita.id_paciente}
            onChange={manejarCambio}
          />
        </label>

        <label>
          ID Médico:
          <input
            type="number"
            name="id_medico"
            value={formCita.id_medico}
            onChange={manejarCambio}
          />
        </label>

        <label>
          ID Consultorio:
          <input
            type="number"
            name="id_consultorio"
            value={formCita.id_consultorio}
            onChange={manejarCambio}
          />
        </label>

        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formCita.fecha}
            onChange={manejarCambio}
          />
        </label>

        <label>
          Hora de inicio:
          <input
            type="time"
            name="hora_inicio"
            value={formCita.hora_inicio}
            onChange={manejarCambio}
          />
        </label>

        <button type="submit">Registrar cita</button>
      </form>

      {mensaje && (
        <p style={{ marginTop: '16px', fontWeight: 'bold' }}>
          {mensaje}
        </p>
      )}

      <hr />

      <h2>Citas registradas</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Consultorio</th>
            <th>Fecha</th>
            <th>Hora inicio</th>
            <th>Hora fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id_cita}>
              <td>{cita.id_cita}</td>
              <td>{cita.id_paciente}</td>
              <td>{cita.id_medico}</td>
              <td>{cita.id_consultorio}</td>
              <td>{cita.fecha}</td>
              <td>{cita.hora_inicio}</td>
              <td>{cita.hora_fin}</td>
              <td>{cita.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;