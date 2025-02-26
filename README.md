
# API de Gestión de Eventos

## Descripción

Esta API permite gestionar eventos y participantes, facilitando la creación, actualización, eliminación e inscripción de participantes en eventos mediantes una relación de muchos a muchos. La API está desarrollada en Node.js con Express y utilizamos MySQL como base de datos.

## Tecnologías utilizadas:

    - Node.js con Express.js.
    - MySQL con mysql2.
    - CORS para permitir conexiones externas.
    - dotenv para la gestión de variables de entorno



## INSTALACIÓN Y CONFIGURACIÓN   

    --> CLONAR REPOSITORIO
        git clone https://github.com/modulo-4-evaluacion-final-bpw-AnaEDiBlasi

    --> INSTALAR DEPENDENCIAS
        npm install

    --> CONFIGURAR VARIABLES DE ENTORNO
        Crear un archivo .env en la raíz del proyecto con los siguientes valores:
        HOSTDB=localhost
        USERDB=(tu usuario)
        PASSDB=(tu contraseña)
        DATADB=gestion_eventos

    --> arrancar el servidor
        npm run dev


## ENDPOINT DE LA API

    - EVENTOS:
        --> Obtener todos los eventos (GET) /eventos
        --> Agregar un nuevo evento (POST) /eventos
        --> Actualizar un evento (PUT) /eventos/:id
        --> Eliminar un evento (DELETE) /eventos/:id
    
    - PARTICIPANTES:
        --> Obtener todos los participantes (GET) /participantes
        --> Agregar un nuevo participante (POST) /participantes
        --> Actualizar datos del participante existente (PUT) /participantes/:id
        --> Eliminar un participante (DELETE) /participantes/:id

    -RELACIÓN EVENTOS -- PARTICIPANTES
        --> Inscribir un participante a un evento(POST) /inscripciones
        --> Obtener eventos de un participante (GET) /participantes/:id/eventos
        --> Obtener participantes de un evento (GET) /eventos/:id/participantes
        --> Obtener todas las inscripciones (GET) /inscripciones/finales


### Notas adicionales
    - La API sigue una estructura RESful.
    - Se recomienda utilizar POSTMAN para probar los endpoints.


