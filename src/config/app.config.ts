export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'task_management',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
  },
  todoist: {
    apiBaseUrl: 'https://api.todoist.com/api/v1',
    syncApiBaseUrl: 'https://api.todoist.com/api/v1/sync',
  },
  swagger: {
    title: 'tast management assignment project(nihal sangole)',
    description:
      'API documentation for the task managemnet platform with todoist integration',
    version: '1.0',
    path: 'api-docs',
  },
});
