import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'combinations_db'
};

export default mysql.createPool(dbConfig);

