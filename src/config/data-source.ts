import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [__dirname + "/../modules/**/*.entity.ts"],
    migrations: [__dirname + "/../migration/*.ts"],
    subscribers: [],
})
