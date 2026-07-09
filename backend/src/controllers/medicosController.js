const medicos = [
  {
    id_medico: 1,
    id_especialidad: 1,
    nombre: 'Laura',
    apellido_paterno: 'Hernández',
    cedula_profesional: 'MED001',
    correo: 'laura.hernandez@medici.com',
    telefono: '5511111111'
  },
  {
    id_medico: 2,
    id_especialidad: 2,
    nombre: 'Carlos',
    apellido_paterno: 'Ramírez',
    cedula_profesional: 'MED002',
    correo: 'carlos.ramirez@medici.com',
    telefono: '5522222222'
  },
  {
    id_medico: 3,
    id_especialidad: 3,
    nombre: 'Ana',
    apellido_paterno: 'Martínez',
    cedula_profesional: 'MED003',
    correo: 'ana.martinez@medici.com',
    telefono: '5533333333'
  }
];

const obtenerMedicos = (req, res) => {
  res.json({
    status: 'ok',
    data: medicos
  });
};

const crearMedico = (req, res) => {
  const nuevoMedico = {
    id_medico: medicos.length + 1,
    ...req.body
  };

  medicos.push(nuevoMedico);

  res.status(201).json({
    status: 'ok',
    message: 'Médico registrado correctamente',
    data: nuevoMedico
  });
};

module.exports = {
  obtenerMedicos,
  crearMedico
};