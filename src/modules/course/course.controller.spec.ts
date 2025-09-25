import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '@/test/setup';
import { CourseService } from '@/modules/course/course.service';
import { RedisService } from '@/modules/redis/redis.service';
import { IListCourseInfo } from '@/modules/course/types/common-course.type';
import * as path from 'node:path';

describe('课程模块', () => {
  let app: INestApplication;
  let service: CourseService;
  let redisService: RedisService;
  let authToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    service = app.get<CourseService>(CourseService);
    redisService = app.get<RedisService>(RedisService);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: '12345678',
      });
    expect(loginResponse.body.code).toBe(200);
    expect(loginResponse.body.message).toBe('请求成功');
    expect(loginResponse.body.data).toStrictEqual({
      userId: expect.any(String),
      user_token: expect.any(String),
      username: expect.any(String),
    });
    authToken = loginResponse.body.data.user_token;
  });

  it('添加课程', async () => {
    const uploadFileResponse = await request(app.getHttpServer())
      .post('/file/upload')
      .field('service', 'course__course_cover_image')
      .attach('files', path.join(__dirname, 'course.controller.spec.ts'));
    console.log(uploadFileResponse.body);

    // const response = await request(app.getHttpServer())
    //   .post('/course/course')
    //   .set('Authorization', 'Bearer ' + authToken)
    //   .send({
    //     // course_name,
    //     // files_key,
    //   });
  });

  it('列出课程', async () => {
    const response = await request(app.getHttpServer())
      .get('/course/course')
      .set('Authorization', 'Bearer ' + authToken);
    response.body.data.forEach((course: IListCourseInfo) => {
      expect(course).toStrictEqual({
        id: expect.any(String),
        name: expect.any(String),
        cover_image: expect.any(String),
        created_by: expect.any(String),
        created_by_user: expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          // username: expect.any(String),
          created_at: expect.any(String),
        }),
      });
    });
  });

  afterAll(async () => {
    if (app) {
      redisService.redis.disconnect();
      await app.close();
    }
  });
});
