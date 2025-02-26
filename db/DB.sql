CREATE DATABASE gestion_eventos;
USE gestion_eventos;

-- Crear tabla de eventos
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    lugar VARCHAR(255) NOT NULL
);

-- Crear tabla de participantes
CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla intermedia para relación muchos a muchos
CREATE TABLE eventos_participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    participante_id INT NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
);


