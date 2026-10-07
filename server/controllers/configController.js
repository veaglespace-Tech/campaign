import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma.js';

// Helper to ensure config exists
const getOrCreateConfig = async () => {
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.siteConfig.create({
      data: {
        id: 1,
        donationUsage: 'Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives across the region. Every contribution helps build a healthier society.',
        demandEnglish: 'I demand to say NO to drugs and substance abuse and to promote awareness, healthy choices and a drug-free society.',
        demandHindi: 'मैं नशीली दवाओं और मादक पदार्थों के सेवन को ना कहने और जागरूकता, स्वस्थ विकल्पों और नशा मुक्त समाज को बढ़ावा देने की प्रतिज्ञा करता हूँ।',
        demandMarathi: 'मी अमली पदार्थ आणि व्यसनांना नाही म्हणण्याची आणि जागरूकता, निरोगी जीवनशैली आणि व्यसनमुक्त समाजाला प्रोत्साहन देण्याची प्रतिज्ञा करतो.',
        certificateFormat: 'This certificate is proudly presented to {name} for taking the demand to SAY NO TO DRUGS and supporting the vision of building a healthier, safer and drug-free society.'
      }
    });
  }
  return config;
};

// @desc    Get site config
// @route   GET /api/config
// @access  Public
export const getConfig = asyncHandler(async (req, res) => {
  const config = await getOrCreateConfig();
  res.json({ success: true, config });
});

// @desc    Update site config
// @route   PUT /api/admin/config
// @access  Private (Admin)
export const updateConfig = asyncHandler(async (req, res) => {
  const { donationUsage, demandEnglish, demandHindi, demandMarathi, certificateFormat } = req.body;
  
  await getOrCreateConfig(); // ensure it exists first
  
  const updatedConfig = await prisma.siteConfig.update({
    where: { id: 1 },
    data: {
      donationUsage,
      demandEnglish,
      demandHindi,
      demandMarathi,
      certificateFormat
    }
  });

  res.json({ success: true, config: updatedConfig, message: 'Configuration updated successfully' });
});
