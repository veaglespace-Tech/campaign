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
  const hindi = "१. संस्थागत जवाबदेही: एमपीएससी अध्यक्ष और सचिव का तत्काल इस्तीफा; आयोग के कामकाज की व्यापक न्यायिक जांच।\n२. परीक्षा प्रणाली सुधार: परीक्षा पैटर्न पर निश्चित निर्णय और ऑनलाइन मूल्यांकन प्रणाली को बंद करना। सामान्यीकरण (Normalization) को पूरी तरह समाप्त करना।\n३. भर्ती और रिक्तियां: 70,000 से अधिक रिक्त पदों के लिए तत्काल भर्ती, सभी निजी आउटसोर्सिंग पर रोक।\n४. आयु में छूट और पात्रता: पीएसआई भर्ती के लिए ऊपरी आयु सीमा में तत्काल वृद्धि।\n५. वित्तीय और प्रशासनिक आसानी: परीक्षा शुल्क में भारी कमी।";
  const marathi = "१. संस्थात्मक उत्तरदायित्व: एमपीएससी अध्यक्ष आणि सचिवांचा त्वरित राजीनामा; आयोगाच्या कामकाजाची सर्वंकष न्यायालयीन चौकशी.\n२. परीक्षा पद्धतीत सुधारणा: परीक्षा पद्धतीवर (वस्तुनिष्ठ विरुद्ध वर्णनात्मक) निश्चित निर्णय आणि ऑनलाइन मूल्यांकन प्रणाली बंद करणे. नॉर्मलायझेशन (Normalization) पूर्णपणे रद्द करणे.\n३. भरती आणि रिक्त पदे: सर्व खाजगी आउटसोर्सिंग थांबवून, केवळ एमपीएससीद्वारे ७०,००० हून अधिक रिक्त पदांसाठी त्वरित भरती.\n४. वयोमर्यादा आणि पात्रता: पीएसआय भरतीसाठी उच्च वयोमर्यादेत त्वरित वाढ.\n५. आर्थिक आणि प्रशासकीय सुलभता: राज्याप्रमाणे सलग परीक्षा कार्ड प्रणाली लागू करणे आणि विद्यार्थ्यांसाठी परीक्षा शुल्कात मोठी कपात.";
  
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        id: 1,
        demandEnglish: english,
        demandHindi: hindi,
        demandMarathi: marathi
      }
    });
    console.log("SiteConfig created.");
  } else {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        demandEnglish: english,
        demandHindi: hindi,
        demandMarathi: marathi
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
