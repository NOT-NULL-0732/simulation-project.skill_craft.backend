import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userSchema } from '@/db/schema/user.schema';

@Injectable()
export class DrizzleService {
  db = drizzle({
    connection: 'postgres://root:root@localhost/example',
    schema: {
      userSchema,
    },
  });
}
