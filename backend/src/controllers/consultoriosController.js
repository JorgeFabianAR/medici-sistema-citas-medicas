const consultorios = [
  {
    id_consultorio: 1,
    nombre: 'Consultorio 1',
    ubicacion: 'Planta baja'
  },
  {
    id_consultorio: 2,
    nombre: 'Consultorio 2',
    ubicacion: 'Planta baja'
  },
  {
    id_consultorio: 3,
    nombre: 'Consultorio 3',
    ubicacion: 'Primer piso'
  }
];

const obtenerConsultorios = (req, res) => {
  res.json({
    status: 'ok',
    data: consultorios
  });
};

const crearConsultorio = (req, res) => {
  const nuevoConsultorio = {
    id_consultorio: consultorios.length + 1,
    ...req.body
  };

  consultorios.push(nuevoConsultorio);

  res.status(201).json({
    status: 'ok',
    message: 'Consultorio registrado correctamente',
    data: nuevoConsultorio
  });
};

module.exports = {
  obtenerConsultorios,
  crearConsultorio
};