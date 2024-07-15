const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Це потрібно для підключення до бази даних на Heroku
            },
        },
    }
);
// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DATABASE_URL,
//         port: process.env.DB_PORT
//     }
// );