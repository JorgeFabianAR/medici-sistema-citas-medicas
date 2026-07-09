const pacientes = [
  {
    id_paciente: 1,
    nombre: 'Paciente',
    apellido_paterno: 'Demo',
    telefono: '5544444444',
    correo: 'paciente1@demo.com'
  }
];

const obtenerPacientes = (req, res) => {
  res.json({
    status: 'ok',
    data: pacientes
  });
};

const crearPaciente = (req, res) => {
  const nuevoPaciente = {
    id_paciente: pacientes.length + 1,
    ...req.body
  };

  pacientes.push(nuevoPaciente);

  res.status(201).json({
    status: 'ok',
    message: 'Paciente registrado correctamente',
    data: nuevoPaciente
  });
};

module.exports = {
  obtenerPacientes,
  crearPaciente
};

