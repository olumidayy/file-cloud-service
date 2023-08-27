// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import logger from '../src/common/logger';

// const prisma = new PrismaClient();
// const password = bcrypt.hashSync('password', bcrypt.genSaltSync(10));
// const userData = [
//   {
//     firstname: 'Alice',
//     lastname: 'Wonder',
//     email: 'alice@prisma.io',
//     password,
//   },
//   {
//     firstname: 'Olumide',
//     lastname: 'Nwosu',
//     email: 'olumide@prisma.io',
//     password,
//   },
//   {
//     firstname: 'Michael',
//     lastname: 'Jackson',
//     email: 'mike@prisma.io',
//     password,
//   },
// ];

// async function main() {
//   logger.info('Start seeding ...');
//   const promises: any = [];
//   for (let i = 0; i < userData.length; i += 1) {
//     const user = userData[i];
//     promises.push(prisma.user.create({
//       data: user,
//     }));
//   }
//   await Promise.all(promises);
//   logger.info('Seeding finished.');
// }

// // main()
// //   .then(async () => {
// //     await prisma.$disconnect();
// //   })
// //   .catch(async (e) => {
// //     logger.error(e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });
