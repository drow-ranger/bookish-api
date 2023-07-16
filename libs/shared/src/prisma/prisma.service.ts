import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

// import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient, Prisma } from '@prisma/client';

// @Injectable()
// export class PrismaService
//   extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
//   implements OnModuleInit
// {
//   constructor() {
//     try {
//       super();
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   async onModuleInit() {
//     this.$on('error', (event) => {
//       console.log(event.target);
//     });
//     try {
//       await this.$connect();
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async enableShutdownHooks(app: INestApplication) {
//     this.$on('beforeExit', async () => {
//       await app.close();
//     });
//   }
// }
