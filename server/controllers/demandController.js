import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { generateCertificate } from '../services/certificateService.js';

// @desc    Create a demand
// @route   POST /api/demands/create
// @access  Public
export const createDemand = asyncHandler(async (req, res) => {
  const { name, mobile, email, profession, city, state, campaignId, demandText, language = 'english' } = req.body;

  if (!name || !mobile || !email || !campaignId) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  // Basic security validation
  if (!/^\d{10}$/.test(mobile)) {
    res.status(400);
    throw new Error('Mobile number must be exactly 10 digits');
  }

  // Strict email validation (RFC 5322 standard-like)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Invalid email format. Please provide a valid email address.');
  }

  // Validate campaign exists BEFORE creating user to prevent orphaned users
  let campaignToUse = parseInt(campaignId);
  const campaignExists = await prisma.campaign.findUnique({ where: { id: campaignToUse } });
  
  if (!campaignExists) {
    let firstActive = await prisma.campaign.findFirst({ where: { status: 'active' } });
    if (!firstActive) {
      // Auto-create default campaign to prevent blocking the demand
      firstActive = await prisma.campaign.create({
        data: {
          name: 'MPSC Protest Support',
          description: 'Register your support to demand fair MPSC exams. Join the movement.',
          status: 'active'
        }
      });
    }
    campaignToUse = firstActive.id;
  }

  let user = await prisma.user.findFirst({
    where: { email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: { name, mobile, email, profession, city, state }
    });
  } else {
    const existingDemand = await prisma.demand.findFirst({
      where: { userId: user.id, campaignId: campaignToUse }
    });
    
    if (existingDemand) {
      res.status(400);
      throw new Error('This email is already registered for this demand. Please use a different email.');
    }
  }

  const demand = await prisma.demand.create({
    data: {
      userId: user.id,
      campaignId: campaignToUse,
      demandText: demandText || 'We demand fair, transparent, and timely MPSC exams.',
      language
    }
  });

  // Fetch SiteConfig for certificate generation
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  
  // Generate standard certificate number
  const certNumber = `MPSC-${new Date().getFullYear()}-${demand.id.toString().padStart(6, '0')}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const pdfBuffer = await generateCertificate(user.name, certNumber, dateStr, language, config);

  const verificationToken = uuidv4();
  
  const certificate = await prisma.certificate.create({
    data: {
      demandId: demand.id,
      certificateNumber: certNumber,
      verificationToken
    }
  });

  res.json({ success: true, demandId: demand.id, certificateNumber: certNumber, message: 'Demand created successfully' });
});



// @desc    Verify Certificate
// @route   GET /api/demands/verify/:certId
// @access  Public
export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: req.params.certId },
    include: { demand: { include: { user: true } } }
  });

  if (!certificate) {
    res.status(404);
    throw new Error('Invalid Certificate');
  }

  res.json({
    success: true,
    data: {
      certificateId: certificate.certificateNumber,
      name: certificate.demand.user.name,
      date: certificate.generatedAt.toLocaleDateString('en-GB'),
      status: 'VERIFIED'
    }
  });
});

// @desc    Download Certificate
// @route   GET /api/demands/download/:certId
// @access  Public
export const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: req.params.certId },
    include: { demand: { include: { user: true } } }
  });

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  
  const dateStr = certificate.generatedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const pdfBuffer = await generateCertificate(
    certificate.demand.user.name,
    certificate.certificateNumber,
    dateStr,
    certificate.demand.language,
    config
  );

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`);
  res.send(pdfBuffer);
});
