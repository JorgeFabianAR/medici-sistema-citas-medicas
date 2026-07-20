const express = require('express');
const router = express.Router();

const {
  obtenerCitas,
  crearCita,
  sugerirHorario,
  obtenerLogsCitas
} = require('../controllers/citasController');

router.get('/logs', obtenerLogsCitas);
router.post('/sugerir-horario', sugerirHorario);
router.get('/', obtenerCitas);
router.post('/', crearCita);

module.exports = router;