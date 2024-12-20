const express = require('express');
const app = express();
const db = require('./database/db'); // Asegúrate de la ruta correcta
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'omi'; // En producción debe ser una variable de entorno
const cors = require('cors');

app.use(express.static('frontend'));

app.use(cors());

// Middleware para leer JSON en las peticiones
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola, este es el servidor de mi app de cursos');
});

// Luego, servir archivos estáticos
app.use(express.static('frontend'));

// Ruta para registrar usuarios con contraseña hasheada
app.post('/register', async (req, res) => {
    const { email, password, nombre } = req.body;
  
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
  
    // Verificar si el usuario ya existe
    const queryCheck = 'SELECT email FROM usuarios WHERE email = ?';
    db.get(queryCheck, [email], async (err, row) => {
      if (err) {
        console.error('Error al buscar usuario', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (row) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
  
      // Hashear la contraseña
      const saltRounds = 10; // coste del hash (mientras más alto, más seguro, pero más lento)
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
  
        const queryInsert = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.run(queryInsert, [nombre, email, hashedPassword], function (err) {
          if (err) {
            console.error('Error al insertar usuario', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
  
          const newUser = {
            id: this.lastID,
            nombre,
            email
            // Nota: No devolvemos la password hasheada en la respuesta
          };
  
          res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
        });
      } catch (hashErr) {
        console.error('Error al hashear la contraseña', hashErr);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });
  

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Validar que vengan ambos campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
  
    const query = 'SELECT id, nombre, email, password FROM usuarios WHERE email = ?';
    db.get(query, [email], async (err, user) => {
      if (err) {
        console.error('Error al buscar usuario', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña enviada con el hash almacenado
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
      }
  
      // Si las credenciales son correctas, generar el token
      const payload = {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ message: 'Login exitoso', token });
    });
  });

  function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no provisto' });
    }
  
    const token = authHeader.split(' ')[1]; // Suponiendo formato "Bearer <token>"
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }
  
      // Guardar la info del usuario en la request
      req.user = decoded;
      next();
    });
  }

  app.get('/cursos-protegidos', verificarToken, (req, res) => {
    console.log('Ruta /cursos-protegidos accedida por:', req.user.nombre);
     res.json(req.user);
});

  // Iniciar el servidor
  app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
  });


