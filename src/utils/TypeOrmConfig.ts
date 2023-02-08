import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "student",
    password: "student",
    database: "kupipodariday",
    entities: [],
    synchronize: true,
};
