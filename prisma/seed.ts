import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.book.upsert({
    where: { title: 'Before the Coffee Gets Cold' },
    update: {},
    create: {
      title: 'Before the Coffee Gets Cold',
      creator: 'Toshikazu Kawaguchi',
      body: "In Before the Coffee Gets Cold, we meet four visitors, each of whom is hoping to make use of the café’s time-travelling offer, in order to: confront the man who left them, receive a letter from their husband whose memory has been taken by early onset Alzheimer's, to see their sister one last time, and to meet the daughter they never got the chance to know.",
      description:
        'In a small back alley in Tokyo, there is a café which has been serving carefully brewed coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time.',
      published: true,
    },
  });

  const post2 = await prisma.book.upsert({
    where: { title: 'Things Left Behind' },
    update: {},
    create: {
      title: 'Things Left Behind',
      creator: 'Kim Sae-Byoul',
      body: "What will happen after we die? What is the true story behind someone's death? Can loneliness truly make a person lose the will to live? Why do some people decide to commit suicide?",
      description:
        "This book reveals a diverse range of real stories behind death, narrated by a caretaker of belongings left behind by deceased individuals, whether they died of natural causes or not—such as murder or suicide. When tasked with cleaning the possessions of the deceased, sometimes shocking cases are encountered, like an elderly person who passed away without anyone knowing and whose body was only discovered weeks later. Written with clarity and emotional depth, this book, which inspired the K-drama 'Move to Heaven,' combines personal experiences and reflections with a flowing and engaging writing style.",
      published: false,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
