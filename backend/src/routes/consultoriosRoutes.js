const express = require('express');
const router = express.Router();

const {
  obtenerConsultorios,
  crearConsultorio
} = require('../controllers/consultoriosController');

router.get('/', obtenerConsultorios);
router.post('/', crearConsultorio);

module.exports = router;