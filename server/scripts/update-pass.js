import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Test@123', salt);
  
  await prisma.adminUser.update({
    where: { email: 'abhijeetambhore4@gmail.com' },
    data: { passwordHash }
  });
  
  console.log('Password updated successfully!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
