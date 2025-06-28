import { defineConfig } from 'drizzle-kit';
import { AppConfig } from '@/common/config/index.config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/*',
  dbCredentials: {
    host: AppConfig.db.host,
    port: AppConfig.db.port,
    user: AppConfig.db.user,
    password: AppConfig.db.password,
    database: AppConfig.db.database,
    ssl: false,
  },
  schemaFilter: ['public'],
});
