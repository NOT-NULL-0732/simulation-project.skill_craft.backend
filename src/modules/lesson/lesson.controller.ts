import { Controller } from '@nestjs/common';
import { DrizzleService } from '@/modules/drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Controller('lesson')
export class LessonController {
  db: NodePgDatabase<typeof import('../../db/schema/index.schema')>;

  constructor(private readonly drizzleService: DrizzleService) {
    const { db } = this.drizzleService;
    this.db = db;
  }
}
