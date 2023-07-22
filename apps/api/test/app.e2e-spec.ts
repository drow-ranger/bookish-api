import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { PrismaService } from '@app/shared';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const bookShape = expect.objectContaining({
    id: expect.any(Number),
    title: expect.any(String),
    creator: expect.any(String),
    description: expect.any(String),
    body: expect.any(String),
    published: expect.any(Boolean),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });

  const booksData = [
    {
      id: 100001,
      title: 'title1',
      creator: 'creator1',
      description: 'description1',
      body: 'body1',
      published: true,
    },
    {
      id: 100002,
      title: 'title2',
      creator: 'creator2',
      description: 'description2',
      body: 'body2',
      published: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.book.create({
      data: booksData[0],
    });
    await prisma.book.create({
      data: booksData[1],
    });
  });

  describe('GET /books', () => {
    it('returns a list of published books', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/books');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([bookShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(booksData[0].id);
      expect(body[0].published).toBeTruthy();
    });

    it('returns a list of draft books', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/books/drafts',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([bookShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(booksData[1].id);
      expect(body[0].published).toBeFalsy();
    });
  });

  describe('GET /books/{id}', () => {
    it('returns a given book', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/books/${booksData[0].id}`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(bookShape);
      expect(body.id).toEqual(booksData[0].id);
    });

    it('fails to return non existing book', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/books/100`,
      );

      expect(status).toBe(404);
    });

    it('fails to return book with invalid id type', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/books/string-id`,
      );

      expect(status).toBe(400);
    });
  });

  describe('POST /books', () => {
    it('creates an book', async () => {
      const beforeCount = await prisma.book.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/books')
        .send({
          id: 100003,
          title: 'title3',
          creator: 'creator3',
          description: 'description3',
          body: 'body3',
          published: false,
        });

      const afterCount = await prisma.book.count();

      expect(status).toBe(201);
      expect(afterCount - beforeCount).toBe(1);
    });

    it('fails to create book without title', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/books')
        .send({
          creator: 'creator4',
          description: 'description4',
          body: 'body4',
          published: true,
        });

      expect(status).toBe(400);
    });
  });

  describe('DEL /books', () => {
    it('deletes a book', async () => {
      const beforeCount = await prisma.book.count();

      const { status, body } = await request(app.getHttpServer()).delete(
        `/books/${booksData[0].id}`,
      );

      const afterCount = await prisma.book.count();

      expect(status).toBe(200);
      expect(beforeCount - 1).toBe(afterCount);
    });

    it('fails to delete non existing book', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        `/books/100`,
      );

      expect(status).toBe(409);
    });
  });
});
