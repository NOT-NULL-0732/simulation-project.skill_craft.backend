import { char } from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';

export const uuidV7PrimaryKey = char({ length: 36 })
  .primaryKey()
  .$defaultFn(() => v7());
