const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'carlosvas12',
    database: 'empresa_dirty'
});



connection.connect((err) => {
    if (err) {
        console.log('Error conectando a la base de datos', err);
        return;
    }
    console.log('Conexion a la base de datos exitosa');
});

module.exports = connection;
