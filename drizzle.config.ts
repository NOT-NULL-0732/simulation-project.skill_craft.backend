import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/*',
  dbCredentials: {
    host: '127.0.0.1',
    port: 5432,
    user: 'root',
    password: 'root',
    database: 'example',
    ssl: false,
  },
  schemaFilter: ['public'],
});
