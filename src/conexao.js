const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.db_host,
        user: process.env.db_user,
        port: process.env.db_port,
        password: process.env.db_password,
        database: process.env.db_dataBase,
    },
});
module.exports = knex;