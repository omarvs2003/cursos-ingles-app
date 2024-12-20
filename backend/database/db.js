const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Aquí definimos la ubicación de la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');

// Creamos una nueva base de datos (si no existe, se crea automáticamente)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err);
  } else {
    console.log('Conectado a la base de datos SQLite');

    // Crear la tabla de usuarios si no existe
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear la tabla de usuarios', err);
      } else {
        console.log('Tabla de usuarios lista o ya existe');
      }
    });
  }
});

module.exports = db;