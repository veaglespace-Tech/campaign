import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Campaign
  let campaign = await prisma.campaign.findFirst({
    where: { name: 'MPSC Students Protest' }
  });

  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        name: 'MPSC Students Protest',
        description: 'Stand united with the students of Maharashtra. Register your support, join the protest to demand fair MPSC exams, and secure your official support certificate today.',
        status: 'active'
      }
    });
    console.log('Campaign MPSC Protest created.');
  } else {
    console.log('Campaign already exists.');
  }

  // 2. Seed Admin User
  const adminEmail = 'abhijeetambhore4@gmail.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Test@123', salt);

    await prisma.adminUser.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'super_admin'
      }
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }

  // 3. Seed SiteConfig
  const existingConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const english = "1. Institutional Accountability: Immediate resignation of the MPSC Chairman and secretary; a comprehensive judicial inquiry into the commission's functioning.\n2. Examination System Reforms: A definitive decision on the exam pattern (Objective vs Descriptive) and discontinuation of online evaluation systems. Complete abolition of normalization.\n3. Recruitment & Vacancies: Immediate declaration and recruitment drive for over 70,000 vacant posts through MPSC only, stopping all private outsourcing.\n4. Age Relaxations & Eligibility: An immediate increase in the upper age limit for PSI recruitment and removal of restrictive criteria like TET for specific roles.\n5. Financial & Administrative Ease: Implementation of a continuous examination card system (like Rajasthan) and massive reduction of examination fees for struggling students.";
  
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        id: 1,
        demandEnglish: english
      }
    });
    console.log("SiteConfig created.");
  } else {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        demandEnglish: english
      }
    });
    console.log("SiteConfig updated.");
  }

  // No dummy users to seed as requested.
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
