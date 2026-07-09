const express = require('express');
const router = express.Router();

const {
  obtenerPacientes,
  crearPaciente
} = require('../controllers/pacientesController');

router.get('/', obtenerPacientes);
router.post('/', crearPaciente);

module.exports = router;