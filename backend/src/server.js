const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacientesRoutes = require('./routes/pacientesRoutes');
const especialidadesRoutes = require('./routes/especialidadesRoutes');
const medicosRoutes = require('./routes/medicosRoutes');
const consultoriosRoutes = require('./routes/consultoriosRoutes');
const citasRoutes = require('./routes/citasRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend de MediCI funcionando');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de MediCI funcionando correctamente'
  });
});

app.use('/api/pacientes', pacientesRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/consultorios', consultoriosRoutes);
app.use('/api/citas', citasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MediCI ejecutándose en http://localhost:${PORT}`);
});