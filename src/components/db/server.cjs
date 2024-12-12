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
            console.log(results);
            if (err) {
                return res.status(500).json({ message: 'Error creando el usuario' });
                
            }
            res.status(201).json({ message: 'Usuario creado con éxito' });
        }
    );
});

app.get('/obtener-cortes', authenticateToken, (req, res) => {
    if (req.user.rol !== 'trabajador') {
        return res.status(403).json({ message: 'Acceso denegado: Solo trabajadores pueden acceder a esta información.' });
    }

    connection.query(
        `SELECT 
            cortes.id AS corte_id,
            cortes.numero_corte AS numeroCorte,
            modelos.nombre AS modelo,
            posiciones.id AS posicionId,
            posiciones.nombre AS posicionNombre,
            IFNULL(posiciones.precio, 0) AS posicionPrecio -- Valor predeterminado si el precio es NULL
        FROM cortes
        JOIN modelos ON cortes.modelo_id = modelos.id
        LEFT JOIN posiciones ON posiciones.modelo_id = modelos.id
        ORDER BY cortes.id;`,
        (err, results) => {
            if (err) {
                console.error('Error al obtener los cortes:', err);
                return res.status(500).json({ message: 'Error al obtener los cortes' });
            }

            const cortes = results.reduce((acc, row) => {
                let corte = acc.find(c => c.id === row.corte_id);
                if (!corte) {
                    corte = {
                        id: row.corte_id,
                        numeroCorte: row.numeroCorte,
                        modelo: row.modelo,
                        posiciones: [],
                    };
                    acc.push(corte);
                }
                if (row.posicionId) {
                    corte.posiciones.push({
                        id: row.posicionId,
                        nombre: row.posicionNombre,
                        precio: parseFloat(row.posicionPrecio), // Convertimos a número
                    });
                }

                return acc;
            }, []);

            res.json(cortes);
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

app.post('/agregar-corte', authenticateToken, (req, res) => {
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'Acceso denegado: Solo administradores pueden agregar cortes.' });
    }

    const { modelo, nuevoModelo, corte, posiciones } = req.body;

    if (!corte || (!modelo && (!nuevoModelo || !posiciones || !Array.isArray(posiciones)))) {
        return res.status(400).json({ message: 'Datos incompletos o inválidos' });
    }

    if (modelo) {
        // Si el modelo ya existe, solo se agrega el nuevo corte
        connection.query(
            'INSERT INTO cortes (numero_corte, modelo_id) VALUES (?, (SELECT id FROM modelos WHERE nombre = ?))',
            [corte, modelo],
            (err, results) => {
                console.log(results);
                if (err) {
                    console.error('Error agregando el corte:', err);
                    return res.status(500).json({ message: 'Error agregando el corte' });
                }
                res.status(201).json({ message: 'Corte agregado con éxito' });
            }
        );
    } else {
        // Si es un nuevo modelo, se registra el modelo y sus posiciones
        connection.query(
            'INSERT INTO modelos (nombre) VALUES (?)',
            [nuevoModelo],
            (err, results) => {
                if (err) {
                    console.error('Error creando el modelo:', err);
                    return res.status(500).json({ message: 'Error creando el modelo' });
                }

                const modeloId = results.insertId;

                // Insertar posiciones asociadas al modelo
                const insertPosiciones = posiciones.map((pos) => [
                    modeloId,
                    pos.nombre,
                    pos.precio,
                ]);

                connection.query(
                    'INSERT INTO posiciones (modelo_id, nombre, precio) VALUES ?',
                    [insertPosiciones],
                    (err) => {
                        if (err) {
                            console.error('Error agregando las posiciones:', err);
                            return res.status(500).json({ message: 'Error al agregar las posiciones.' });
                        }
                    }
                );

                // Insertar el nuevo corte asociado al modelo
                connection.query(
                    'INSERT INTO cortes (numero_corte, modelo_id) VALUES (?, ?)',
                    [corte, modeloId],
                    (err) => {
                        if (err) {
                            console.error('Error agregando el corte:', err);
                            return res.status(500).json({ message: 'Error agregando el corte' });
                        }
                        res.status(201).json({ message: 'Modelo, posiciones y corte agregados con éxito' });
                    }
                );
            }
        );
    }
});

