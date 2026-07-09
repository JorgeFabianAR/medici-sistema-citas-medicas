const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacientesRoutes = require('./routes/pacientesRoutes');

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MediCI ejecutándose en http://localhost:${PORT}`);
});