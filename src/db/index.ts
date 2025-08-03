import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema/index.schema';
import { AppConfig } from '@/common/config/index.config';

const db = drizzle({
  connection: AppConfig.db.connectionString,
  schema,
});

export default db;
