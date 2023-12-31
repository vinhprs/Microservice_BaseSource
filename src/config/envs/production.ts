export const config = {
  db: {
    synchronize: false,
    logging: false,
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    schema: process.env.DB_SCHEMA || 'auth',
    extra: {
      connectionLimit: 1000,
    },
    autoLoadEntities: true,
  },
  graphql: {
    debug: false,
    playground: false,
  },
  foo: 'pro-bar',
};
