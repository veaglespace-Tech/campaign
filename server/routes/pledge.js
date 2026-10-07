import express from 'express';
import { 
  createPledge, 
  completePledge, 
  verifyCertificate,
  downloadCertificate
} from '../controllers/pledgeController.js';

const router = express.Router();

router.post('/create', createPledge);
router.post('/complete', completePledge);
router.get('/verify/:certId', verifyCertificate);
router.get('/download/:certId', downloadCertificate);

export default router;
