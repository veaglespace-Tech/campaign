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
        donationEnabled: true,
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
    const passwordHash = await bcrypt.hash('Veagle@123', salt);

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
  const english = "I pledge my full support to the MPSC Students Protest. I stand for a fair, transparent, and timely examination process.";
  const hindi = "मैं एमपीएससी छात्रों के विरोध को अपना पूर्ण समर्थन देने की प्रतिज्ञा करता हूँ। मैं एक निष्पक्ष, पारदर्शी और समय पर परीक्षा प्रक्रिया के पक्ष में खड़ा हूँ।";
  const marathi = "मी एमपीएससी विद्यार्थ्यांच्या आंदोलनाला माझा पूर्ण पाठिंबा देण्याची प्रतिज्ञा करतो. मी न्याय्य, पारदर्शक आणि वेळेवर परीक्षा प्रक्रियेच्या बाजूने उभा आहे.";
  
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        id: 1,
        pledgeEnglish: english,
        pledgeHindi: hindi,
        pledgeMarathi: marathi,
        donationUsage: "Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives."
      }
    });
    console.log("SiteConfig created.");
  } else {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        pledgeEnglish: english,
        pledgeHindi: hindi,
        pledgeMarathi: marathi
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
