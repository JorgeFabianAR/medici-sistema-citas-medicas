let citas = [
  {
    id_cita: 1,
    id_paciente: 1,
    id_medico: 1,
    id_consultorio: 1,
    fecha: '2026-07-10',
    hora_inicio: '09:00',
    hora_fin: '09:30',
    estado: 'PROGRAMADA',
    metodo_agendamiento: 'MANUAL_SIMULADO'
  }
];

let logsCitas = [];

const convertirHoraAMinutos = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

const convertirMinutosAHora = (minutosTotales) => {
  const horas = Math.floor(minutosTotales / 60).toString().padStart(2, '0');
  const minutos = (minutosTotales % 60).toString().padStart(2, '0');
  return `${horas}:${minutos}`;
};

const sumarMinutos = (hora, minutosAgregar) => {
  return convertirMinutosAHora(convertirHoraAMinutos(hora) + minutosAgregar);
};

const existeEmpalme = ({ id_medico, id_consultorio, fecha, hora_inicio, hora_fin }) => {
  const inicioNueva = convertirHoraAMinutos(hora_inicio);
  const finNueva = convertirHoraAMinutos(hora_fin);

  return citas.find((cita) => {
    if (cita.fecha !== fecha || cita.estado !== 'PROGRAMADA') {
      return false;
    }

    const mismoMedico = Number(cita.id_medico) === Number(id_medico);
    const mismoConsultorio = Number(cita.id_consultorio) === Number(id_consultorio);

    if (!mismoMedico && !mismoConsultorio) {
      return false;
    }

    const inicioExistente = convertirHoraAMinutos(cita.hora_inicio);
    const finExistente = convertirHoraAMinutos(cita.hora_fin);

    return inicioNueva < finExistente && finNueva > inicioExistente;
  });
};

const sugerirHorarioDisponible = ({ id_medico, id_consultorio, fecha }) => {
  const inicioJornada = convertirHoraAMinutos('08:00');
  const finJornada = convertirHoraAMinutos('16:00');
  const duracion = 30;

  for (let minuto = inicioJornada; minuto < finJornada; minuto += duracion) {
    const hora_inicio = convertirMinutosAHora(minuto);
    const hora_fin = convertirMinutosAHora(minuto + duracion);

    const conflicto = existeEmpalme({
      id_medico,
      id_consultorio,
      fecha,
      hora_inicio,
      hora_fin
    });

    if (!conflicto) {
      return {
        hora_inicio,
        hora_fin
      };
    }
  }

  return null;
};

const registrarLog = (log) => {
  const nuevoLog = {
    id_log: logsCitas.length + 1,
    fecha_evento: new Date().toISOString(),
    ...log
  };

  logsCitas.push(nuevoLog);
  return nuevoLog;
};

const obtenerCitas = (req, res) => {
  res.json({
    status: 'ok',
    data: citas
  });
};

const crearCita = (req, res) => {
  const inicioProceso = Date.now();

  const {
    id_paciente,
    id_medico,
    id_consultorio,
    fecha,
    hora_inicio,
    metodo_agendamiento = 'AUTOMATICO'
  } = req.body;

  if (!id_paciente || !id_medico || !id_consultorio || !fecha || !hora_inicio) {
    const tiempo = Number(((Date.now() - inicioProceso) / 1000).toFixed(2));

    registrarLog({
      id_cita: null,
      metodo_agendamiento,
      tiempo_registro_segundos: tiempo,
      error_empalme: false,
      cita_exitosa: false,
      tipo_error: 'CAMPOS_OBLIGATORIOS',
      descripcion_evento: 'Faltan campos obligatorios para registrar la cita'
    });

    return res.status(400).json({
      status: 'error',
      message: 'Faltan campos obligatorios para registrar la cita'
    });
  }

  const hora_fin = req.body.hora_fin || sumarMinutos(hora_inicio, 30);

  const conflicto = existeEmpalme({
    id_medico,
    id_consultorio,
    fecha,
    hora_inicio,
    hora_fin
  });

  if (conflicto) {
    const sugerencia = sugerirHorarioDisponible({
      id_medico,
      id_consultorio,
      fecha
    });

    const tiempo = Number(((Date.now() - inicioProceso) / 1000).toFixed(2));

    registrarLog({
      id_cita: null,
      metodo_agendamiento,
      tiempo_registro_segundos: tiempo,
      error_empalme: true,
      cita_exitosa: false,
      horario_sugerido: !!sugerencia,
      tipo_error: 'EMPALME_HORARIO',
      descripcion_evento: 'La cita presenta empalme con médico o consultorio'
    });

    return res.status(409).json({
      status: 'error',
      message: 'No se pudo registrar la cita porque existe un empalme de horario',
      conflicto,
      sugerencia
    });
  }

  const nuevaCita = {
    id_cita: citas.length + 1,
    id_paciente: Number(id_paciente),
    id_medico: Number(id_medico),
    id_consultorio: Number(id_consultorio),
    fecha,
    hora_inicio,
    hora_fin,
    estado: 'PROGRAMADA',
    metodo_agendamiento
  };

  citas.push(nuevaCita);

  const tiempo = Number(((Date.now() - inicioProceso) / 1000).toFixed(2));

  registrarLog({
    id_cita: nuevaCita.id_cita,
    metodo_agendamiento,
    tiempo_registro_segundos: tiempo,
    error_empalme: false,
    cita_exitosa: true,
    horario_sugerido: false,
    tipo_error: null,
    descripcion_evento: 'Cita registrada correctamente'
  });

  res.status(201).json({
    status: 'ok',
    message: 'Cita registrada correctamente',
    data: nuevaCita
  });
};

const sugerirHorario = (req, res) => {
  const { id_medico, id_consultorio, fecha } = req.body;

  if (!id_medico || !id_consultorio || !fecha) {
    return res.status(400).json({
      status: 'error',
      message: 'Se requiere médico, consultorio y fecha para sugerir horario'
    });
  }

  const sugerencia = sugerirHorarioDisponible({
    id_medico,
    id_consultorio,
    fecha
  });

  res.json({
    status: 'ok',
    sugerencia
  });
};

const obtenerLogsCitas = (req, res) => {
  res.json({
    status: 'ok',
    total: logsCitas.length,
    data: logsCitas
  });
};

module.exports = {
  obtenerCitas,
  crearCita,
  sugerirHorario,
  obtenerLogsCitas
};