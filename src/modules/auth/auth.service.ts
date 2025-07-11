import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@/modules/drizzle/drizzle.service';
import * as crypto from 'node:crypto';
import { userSchema } from '@/db/schema/user.schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { LoginZSchema, RegisterZSchema } from '@/modules/auth/auth.z-schema';
// @ts-ignore
import { DrizzleQueryError } from 'drizzle-orm/errors';

@Injectable()
export class AuthService {
  constructor(private readonly drizzleService: DrizzleService) {}

  _hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(data: z.infer<typeof RegisterZSchema>) {
    try {
      await this.drizzleService.db.insert(userSchema).values({
        user_name: data.user_name,
        password: this._hashPassword(data.password),
        email: data.email,
      });
    } catch (err: unknown) {
      if (err instanceof DrizzleQueryError && err) {
        throw new BusinessException(
          ResponseStatusCode.COMMON_INSERT_UNIQUE_ERROR,
          '用户名重复',
        );
      }
    }
  }

  async login(data: z.infer<typeof LoginZSchema>) {
    const user = await this.drizzleService.db.query.userSchema.findFirst({
      where: and(
        eq(userSchema.email, data.email),
        eq(userSchema.password, this._hashPassword(data.password)),
      ),
    });
    if (!user)
      throw new BusinessException(ResponseStatusCode.AUTH__PASSWORD_ERROR);
    const user_token = this._genRandomToken(user.id, new Date());
    const updatedUsers = await this.drizzleService.db
      .update(userSchema)
      .set({ user_token })
      .where(eq(userSchema.id, user.id))
      .returning();
    const updatedUser = updatedUsers[0];
    return {
      id: updatedUser.id,
      user_name: updatedUser.user_name,
      user_token: updatedUser.user_token,
    };
  }

  async validateUserToken(userToken?: string): Promise<number> {
    if (!userToken)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );
    const [dateTime, userId, token] = userToken.split('-');

    const parseDateTime = z.coerce.date().safeParse(new Date(Number(dateTime)));
    const parseUserId = z.coerce.number().safeParse(userId);
    const parseToken = z.coerce.string().safeParse(token);

    if (!parseDateTime.success || !parseUserId.success || !parseToken.success)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );

    // 计算过期;
    if (Date.now() - parseDateTime.data.getTime() > 1000 * 60 * 60 * 24 * 7)
      throw new BusinessException(ResponseStatusCode.AUTH__TOKEN_DATE_ERROR);
    if (
      !(
        this._genRandomToken(parseUserId.data, parseDateTime.data) === userToken
      )
    )
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );

    const findResult = await this.drizzleService.db.query.userSchema.findFirst({
      where: and(
        eq(userSchema.id, parseUserId.data),
        eq(userSchema.user_token, userToken),
      ),
    });
    if (!findResult)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );
    return parseUserId.data;
  }

  private _genRandomToken(userId: number, date: Date) {
    const key = crypto.createHash('sha256');
    const signDate = date.getTime().toString();
    key.update(signDate);
    key.update(userId.toString());
    key.update(
      '8X^%pl$FKof5kYmQJSJ&&ao#!k4V*i5u#u^!6q@57!3u0$180yk7h^#46$kdi&5wc6N5ZLZUh!E@ic*Dk18&H5t%P@oM&YilhcYe',
    );
    return signDate + '-' + userId.toString() + '-' + key.digest('hex');
  }
}
