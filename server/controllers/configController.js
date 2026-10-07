import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma.js';

// Helper to ensure config exists
const getOrCreateConfig = async () => {
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.siteConfig.create({
      data: {
        id: 1,
        demandEnglish: 'I demand to say NO to drugs and substance abuse and to promote awareness, healthy choices and a drug-free society.',
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
  const { demandEnglish, certificateFormat } = req.body;
  
  await getOrCreateConfig(); // ensure it exists first
  
  const updatedConfig = await prisma.siteConfig.update({
    where: { id: 1 },
    data: {
      demandEnglish,
      certificateFormat
    }
  });

  res.json({ success: true, config: updatedConfig, message: 'Configuration updated successfully' });
});
