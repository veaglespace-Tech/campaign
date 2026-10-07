import express from 'express';
import { 
  createDemand, 
  verifyCertificate,
  downloadCertificate
} from '../controllers/demandController.js';

const router = express.Router();

router.post('/create', createDemand);
router.get('/verify/:certId', verifyCertificate);
router.get('/download/:certId', downloadCertificate);

export default router;
