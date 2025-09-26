import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema/index.schema';
import { AppConfig } from '@/common/config/index.config';
import { sql } from 'drizzle-orm';
import { Logger } from '@nestjs/common';

const db = drizzle({
  connection: AppConfig.db.connectionString,
  logger: true,
  schema,
});

db.execute(sql`select 1;`)
  .then(() => {
    Logger.verbose('数据库已连接');
  })
  .catch((err) => {
    Logger.error('数据库连接失败');
    console.log(err);
  });

export default db;
