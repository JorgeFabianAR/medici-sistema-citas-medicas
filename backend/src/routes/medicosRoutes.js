const express = require('express');
const router = express.Router();

const {
  obtenerMedicos,
  crearMedico
} = require('../controllers/medicosController');

router.get('/', obtenerMedicos);
router.post('/', crearMedico);

module.exports = router;