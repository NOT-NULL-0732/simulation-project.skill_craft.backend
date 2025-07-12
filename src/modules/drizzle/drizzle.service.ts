import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AppConfig } from '@/common/config/index.config';
import * as schema from '@/db/schema/index.schema';

@Injectable()
export class DrizzleService {
  db: NodePgDatabase<typeof schema>;

  constructor() {
    this.db = drizzle({
      connection: AppConfig.db.connectionString,
      schema: {
        ...schema,
      },
    });
  }
}
