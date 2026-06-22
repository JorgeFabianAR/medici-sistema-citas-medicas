CREATE DATABASE IF NOT EXISTS medici_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE medici_db;

-- =====================================================
-- TABLA: usuarios
-- Personal que usará el sistema: administrador o recepcionista
-- =====================================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR', 'RECEPCIONISTA') NOT NULL DEFAULT 'RECEPCIONISTA',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: pacientes
-- Datos básicos del paciente.
-- Para pruebas se recomienda usar datos ficticios.
-- =====================================================
CREATE TABLE pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: especialidades
-- Catálogo de especialidades médicas
-- =====================================================
CREATE TABLE especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: medicos
-- Información de los médicos registrados
-- =====================================================
CREATE TABLE medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    id_especialidad INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    cedula_profesional VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
);

-- =====================================================
-- TABLA: consultorios
-- Espacios físicos donde se atienden las citas
-- =====================================================
CREATE TABLE consultorios (
    id_consultorio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    ubicacion VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: horarios_medicos
-- Define los días y horarios disponibles de cada médico
-- dia_semana: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves,
-- 5=Viernes, 6=Sábado, 7=Domingo
-- =====================================================
CREATE TABLE horarios_medicos (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT NOT NULL,
    dia_semana TINYINT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_consulta_minutos INT NOT NULL DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico),
    CHECK (dia_semana BETWEEN 1 AND 7),
    CHECK (hora_inicio < hora_fin),
    CHECK (duracion_consulta_minutos > 0)
);

-- =====================================================
-- TABLA: citas
-- Registro principal de citas médicas
-- =====================================================
CREATE TABLE citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    id_consultorio INT NOT NULL,
    id_usuario_registro INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo_consulta VARCHAR(255),
    estado ENUM('PROGRAMADA', 'CANCELADA', 'REPROGRAMADA', 'ATENDIDA', 'NO_ASISTIO') 
        NOT NULL DEFAULT 'PROGRAMADA',
    metodo_agendamiento ENUM('MANUAL_SIMULADO', 'AUTOMATICO') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico),
    FOREIGN KEY (id_consultorio) REFERENCES consultorios(id_consultorio),
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario),
    CHECK (hora_inicio < hora_fin)
);

-- Evita que un médico tenga dos citas exactamente en el mismo inicio
CREATE UNIQUE INDEX uq_medico_fecha_hora
ON citas (id_medico, fecha, hora_inicio);

-- Evita que un consultorio tenga dos citas exactamente en el mismo inicio
CREATE UNIQUE INDEX uq_consultorio_fecha_hora
ON citas (id_consultorio, fecha, hora_inicio);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_citas_fecha ON citas(fecha);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_medico ON citas(id_medico);

-- =====================================================
-- TABLA: logs_citas
-- Guarda los datos necesarios para validar la hipótesis:
-- tiempo de registro, errores, empalmes, citas exitosas y método usado.
-- =====================================================
CREATE TABLE logs_citas (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NULL,
    id_usuario INT NULL,
    metodo_agendamiento ENUM('MANUAL_SIMULADO', 'AUTOMATICO') NOT NULL,
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_registro_segundos DECIMAL(10,2) NOT NULL,
    error_empalme BOOLEAN DEFAULT FALSE,
    cita_exitosa BOOLEAN DEFAULT TRUE,
    horario_sugerido BOOLEAN DEFAULT FALSE,
    intentos_realizados INT DEFAULT 1,
    tipo_error VARCHAR(100),
    descripcion_evento VARCHAR(255),
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CHECK (tiempo_registro_segundos >= 0),
    CHECK (intentos_realizados >= 1)
);

CREATE INDEX idx_logs_metodo ON logs_citas(metodo_agendamiento);
CREATE INDEX idx_logs_fecha ON logs_citas(fecha_evento);
CREATE INDEX idx_logs_empalme ON logs_citas(error_empalme);
CREATE INDEX idx_logs_exitosa ON logs_citas(cita_exitosa);

-- =====================================================
-- DATOS INICIALES DE PRUEBA
-- =====================================================

INSERT INTO usuarios (nombre, correo, password_hash, rol)
VALUES 
('Administrador MediCI', 'admin@medici.com', 'password_hash_demo', 'ADMINISTRADOR'),
('Recepcionista Demo', 'recepcion@medici.com', 'password_hash_demo', 'RECEPCIONISTA');

INSERT INTO especialidades (nombre, descripcion)
VALUES 
('Medicina General', 'Atención médica general'),
('Pediatría', 'Atención médica para niños'),
('Cardiología', 'Atención de enfermedades del corazón'),
('Ginecología', 'Atención médica ginecológica'),
('Traumatología', 'Atención de lesiones musculares y óseas');

INSERT INTO consultorios (nombre, ubicacion)
VALUES
('Consultorio 1', 'Planta baja'),
('Consultorio 2', 'Planta baja'),
('Consultorio 3', 'Primer piso'),
('Consultorio 4', 'Primer piso');

INSERT INTO medicos (
    id_especialidad, 
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    cedula_profesional, 
    correo, 
    telefono
)
VALUES
(1, 'Laura', 'Hernández', 'Pérez', 'MED001', 'laura.hernandez@medici.com', '5511111111'),
(2, 'Carlos', 'Ramírez', 'Gómez', 'MED002', 'carlos.ramirez@medici.com', '5522222222'),
(3, 'Ana', 'Martínez', 'López', 'MED003', 'ana.martinez@medici.com', '5533333333');

INSERT INTO horarios_medicos (
    id_medico, 
    dia_semana, 
    hora_inicio, 
    hora_fin, 
    duracion_consulta_minutos
)
VALUES
(1, 1, '08:00:00', '14:00:00', 30),
(1, 2, '08:00:00', '14:00:00', 30),
(1, 3, '08:00:00', '14:00:00', 30),
(2, 1, '10:00:00', '16:00:00', 30),
(2, 3, '10:00:00', '16:00:00', 30),
(2, 5, '10:00:00', '16:00:00', 30),
(3, 2, '09:00:00', '15:00:00', 30),
(3, 4, '09:00:00', '15:00:00', 30);

INSERT INTO pacientes (
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    telefono, 
    correo, 
    fecha_nacimiento
)
VALUES
('Paciente', 'Demo', 'Uno', '5544444444', 'paciente1@demo.com', '1998-05-10'),
('Paciente', 'Demo', 'Dos', '5555555555', 'paciente2@demo.com', '2001-08-15'),
('Paciente', 'Demo', 'Tres', '5566666666', 'paciente3@demo.com', '1985-11-20');
