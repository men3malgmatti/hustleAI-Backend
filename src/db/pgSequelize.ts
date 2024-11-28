import { Sequelize } from "sequelize";

const dbUser= process.env.POSTGRES_USER;
const dbPassword= process.env.POSTGRES_PASSWORD;
const dbHost= process.env.POSTGRES_HOST;
const dbPort= process.env.POSTGRES_PORT;
const dbName= process.env.POSTGRES_DB;

const sequelize= new Sequelize({
    database: dbName,
    username: dbUser,
    password: dbPassword,
    dialect: 'postgres',
    host: dbHost,
    port: Number(dbPort),
    logging: false,
})

export default sequelize;