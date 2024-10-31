const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('./bd.cjs');

const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8100',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para autenticar token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación requerido' });
    }

    jwt.verify(token, 'clave_secreta', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.user = user;
        next();
    });
};

// Ruta para crear un usuario (solo administradores)
app.post('/crear-usuario', (req, res) => {
    const { nombre, email, contrasena, rol } = req.body;

    if (rol !== 'administrador' && rol !== 'trabajador') {
        return res.status(400).json({ message: 'Rol inválido' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(contrasena, salt);

    connection.query(
        'INSERT INTO trabajadores (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hashedPassword, rol],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error creando el usuario' });
            }
            res.status(201).json({ message: 'Usuario creado con éxito' });
        }
    );
});

// Ruta para el login
app.post('/login', (req, res) => {
    const { email, contrasena } = req.body;

    connection.query(
        'SELECT * FROM trabajadores WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const user = results[0];
            const validPassword = bcrypt.compareSync(contrasena, user.contrasena);

            if (!validPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                'clave_secreta',
                { expiresIn: '1h' }
            );

            res.json({ message: 'Inicio de sesión exitoso', token, rol: user.rol });
        }
    );
});

// Ruta protegida de ejemplo
app.get('/perfil', authenticateToken, (req, res) => {
    res.json({ message: 'Bienvenido a tu perfil', usuario: req.user });
});

// Ruta solo para administradores
app.get('/admin', authenticateToken, (req, res) => {
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
    }
    res.json({ message: 'Bienvenido, administrador' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
