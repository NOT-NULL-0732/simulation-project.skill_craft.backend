import { Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleService } from '@/modules/drizzle/drizzle.service';

@Injectable()
export class LessonService {
  db: NodePgDatabase<typeof import('../../db/schema/index.schema')>;

  constructor(private readonly drizzleService: DrizzleService) {
    const { db } = this.drizzleService;
    this.db = db;
  }
}
