import { LogLevel } from "bunyan";

export const config = {
  db: {
    user: 'jeopardy',
    host: 'postgres',
    database: 'jeopardy',
    password: 'trebek4prez2020',
    port: 5432,
  },
  jwtSecret: 'secrettoken',
  logLevel: 'INFO' as LogLevel,
  debug: false,
  https: false,
};
