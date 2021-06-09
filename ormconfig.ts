module.exports = {
  host: process.env.DB_HOST,
  type: process.env.DB_TYPE,
  port: process.env.DB_PORT,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};