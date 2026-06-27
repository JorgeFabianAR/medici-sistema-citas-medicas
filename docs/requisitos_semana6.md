Requisitos funcionales
ID	Requisito funcional
RF01	El sistema permitirá iniciar sesión al personal autorizado.
RF02	El sistema permitirá registrar pacientes.
RF03	El sistema permitirá consultar pacientes registrados.
RF04	El sistema permitirá registrar médicos y especialidades.
RF05	El sistema permitirá registrar consultorios.
RF06	El sistema permitirá registrar citas médicas.
RF07	El sistema verificará la disponibilidad del médico antes de guardar una cita.
RF08	El sistema verificará la disponibilidad del consultorio antes de guardar una cita.
RF09	El sistema evitará empalmes de citas en el mismo horario.
RF10	El sistema sugerirá horarios disponibles cuando el horario solicitado no esté libre.
RF11	El sistema permitirá cancelar o reprogramar citas.
RF12	El sistema registrará logs de cada intento de agendamiento.
RF13	El sistema mostrará métricas básicas de tiempo de registro, errores y citas exitosas.
Requisitos no funcionales
ID	Requisito no funcional
RNF01	La interfaz deberá ser clara, intuitiva y responsiva.
RNF02	El backend deberá estar separado del frontend mediante una API REST.
RNF03	La base de datos deberá conservar la información de manera persistente.
RNF04	Las credenciales de base de datos deberán almacenarse en variables de entorno.
RNF05	El sistema deberá validar campos obligatorios antes de guardar información.
RNF06	El sistema deberá mostrar mensajes amigables ante errores de usuario o sistema.
RNF07	El código deberá organizarse por rutas, controladores, modelos y configuración.
RNF08	Las operaciones principales deberán responder en un tiempo aceptable para el usuario.
RNF09	El sistema deberá utilizar datos ficticios o anonimizados durante las pruebas.
RNF10	El repositorio deberá mantener commits constantes y descriptivos.
