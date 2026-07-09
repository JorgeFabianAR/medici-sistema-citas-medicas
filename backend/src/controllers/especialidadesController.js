const especialidades = [
  {
    id_especialidad: 1,
    nombre: 'Medicina General',
    descripcion: 'Atención médica general'
  },
  {
    id_especialidad: 2,
    nombre: 'Pediatría',
    descripcion: 'Atención médica para niños'
  },
  {
    id_especialidad: 3,
    nombre: 'Cardiología',
    descripcion: 'Atención de enfermedades del corazón'
  }
];

const obtenerEspecialidades = (req, res) => {
  res.json({
    status: 'ok',
    data: especialidades
  });
};

const crearEspecialidad = (req, res) => {
  const nuevaEspecialidad = {
    id_especialidad: especialidades.length + 1,
    ...req.body
  };

  especialidades.push(nuevaEspecialidad);

  res.status(201).json({
    status: 'ok',
    message: 'Especialidad registrada correctamente',
    data: nuevaEspecialidad
  });
};

module.exports = {
  obtenerEspecialidades,
  crearEspecialidad
};