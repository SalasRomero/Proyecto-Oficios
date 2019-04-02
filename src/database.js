const mysql = require('mysql');
const { promisify } = require('util');
//requiero de los campos llaves
const { database } = require('./keys');

const pool= mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Error de conexion con la bd');
        }if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Hay muchas conexiones');
        }if(err.code ==='ECONNREFUSED'){
            console.err('Coneccion a la bd rechazada');
        }
    }
    if(connection) connection.release();
    console.log('Conexion exitosa');
    return;
});
pool.query= promisify(pool.query);
module.exports=pool;