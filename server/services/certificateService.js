import 'regenerator-runtime/runtime.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (
  name,
  certificateNumber,
  date,
  language = 'english',
  config = {}
) => {
  // ============================================================
  // PDF SETUP
  // ============================================================

  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);

  // ============================================================
  // FONTS
  // ============================================================

  const timesRomanFont = await pdfDoc.embedFont(
    StandardFonts.TimesRoman
  );

  const timesRomanBoldFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBold
  );

  // ============================================================
  // DEVANAGARI FONT
  // ============================================================

  let customFont = timesRomanFont;

  try {
    const fontPath = path.join(
      __dirname,
      '../fonts/NotoSansDevanagari-Regular.ttf'
    );

    if (fs.existsSync(fontPath)) {
      const fontBytes = fs.readFileSync(fontPath);
      customFont = await pdfDoc.embedFont(fontBytes);
    } else {
      console.warn(
        'NotoSansDevanagari-Regular.ttf not found. Using fallback font.'
      );
    }
  } catch (error) {
    console.error(
      'Could not load Devanagari font:',
      error
    );
  }

  // ============================================================
  // PAGE SIZE
  // ============================================================

  const width = 1024;
  const height = 683;

  const page = pdfDoc.addPage([
    width,
    height,
  ]);

  // ============================================================
  // LOAD CERTIFICATE TEMPLATE
  // ============================================================

  const templatePath = path.join(
    __dirname,
    '../assets/certificate_full.jpg'
  );

  try {
    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Certificate template not found: ${templatePath}`
      );
    }

    const templateBytes = fs.readFileSync(
      templatePath
    );

    const templateImage =
      await pdfDoc.embedJpg(templateBytes);

    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  } catch (error) {
    console.error(
      'Template image could not be loaded:',
      error
    );

    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(
        0.95,
        0.95,
        0.95
      ),
    });
  }

  // ============================================================
  // CERTIFICATE AREA
  // ============================================================

  const CERT_LEFT = 400;
  const CERT_RIGHT = 1015;

  const CERT_CENTER_X =
    CERT_LEFT +
    (CERT_RIGHT - CERT_LEFT) / 2;

  // ============================================================
  // NAME
  // ============================================================

  const isDevanagari =
    /[\u0900-\u097F]/.test(name);

  const nameFont = isDevanagari
    ? customFont
    : timesRomanBoldFont;

  const NAME_Y = 431;

  const MAX_NAME_WIDTH = 350;

  let nameSize = 34;

  let nameWidth =
    nameFont.widthOfTextAtSize(
      name,
      nameSize
    );

  // Automatically reduce font size
  // for long names
  while (
    nameWidth > MAX_NAME_WIDTH &&
    nameSize > 20
  ) {
    nameSize -= 1;

    nameWidth =
      nameFont.widthOfTextAtSize(
        name,
        nameSize
      );
  }

  const nameX =
    CERT_CENTER_X -
    nameWidth / 2;

  page.drawText(name, {
    x: nameX,
    y: NAME_Y,
    size: nameSize,
    font: nameFont,
    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // DEMANDS
  // ============================================================
  
  const pledgeEnglish = config?.pledgeEnglish || `1. We demand that the MPSC exams be conducted fairly and transparently without any delays.\n2. We strongly demand the immediate announcement of the exam schedule for Agriculture Services and other exams.\n3. We demand that the government immediately fill all vacant positions in various departments.\n4. We stand united for the rights of all students and demand justice.`;
  const pledgeMarathi = config?.pledgeMarathi || `१. एमपीएससीच्या परीक्षा वेळेवर आणि पारदर्शकपणे घेण्यात याव्यात अशी आमची मागणी आहे.\n२. कृषी सेवा आणि इतर परीक्षांचे वेळापत्रक त्वरित जाहीर करण्यात यावे.\n३. शासनाने विविध विभागांतील सर्व रिक्त पदे लवकरात लवकर भरावीत.\n४. विद्यार्थ्यांच्या हक्कासाठी आम्ही सर्वजण एकत्र उभे आहोत आणि न्यायाची मागणी करत आहोत.`;
  const pledgeHindi = config?.pledgeHindi || `१. हमारी मांग है कि एमपीएससी की परीक्षाएं समय पर और पारदर्शी तरीके से आयोजित की जाएं।\n२. कृषि सेवा और अन्य परीक्षाओं का कार्यक्रम तुरंत घोषित किया जाए।\n३. सरकार विभिन्न विभागों में सभी रिक्त पदों को जल्द से जल्द भरे।\n४. हम छात्रों के अधिकारों के लिए एकजुट हैं और न्याय की मांग करते हैं।`;

  let demandsText = pledgeEnglish;
  if (language === 'marathi') demandsText = pledgeMarathi;
  else if (language === 'hindi') demandsText = pledgeHindi;

  // Blank out the old pre-printed pledge text
  page.drawRectangle({
    x: 410,
    y: 170,
    width: 580,
    height: 230,
    color: rgb(1, 1, 1), 
  });

  let currentY = 380;
  page.drawText(language === 'marathi' ? 'आमच्या मागण्या:' : (language === 'hindi' ? 'हमारी मांगें:' : 'Our Demands:'), {
    x: 420,
    y: currentY,
    size: 14,
    font: timesRomanBoldFont,
    color: rgb(0.08, 0.16, 0.28),
  });
  
  currentY -= 25;

  const demandsLines = demandsText.split('\n').filter(line => line.trim() !== '');
  for (const line of demandsLines) {
    const words = line.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine === '' ? word : currentLine + ' ' + word;
      const testWidth = nameFont.widthOfTextAtSize(testLine, 11);
      if (testWidth > 560) {
        page.drawText(currentLine, { x: 420, y: currentY, size: 11, font: nameFont, color: rgb(0.2, 0.2, 0.2) });
        currentLine = word;
        currentY -= 16;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine !== '') {
      page.drawText(currentLine, { x: 420, y: currentY, size: 11, font: nameFont, color: rgb(0.2, 0.2, 0.2) });
      currentY -= 22;
    }
  }


  // ============================================================
  // VERIFICATION URL
  // ============================================================

  const clientUrl =
    process.env.CLIENT_URL ||
    'http://localhost:3000';

  const verifyUrl =
    `${clientUrl}/verify/${certificateNumber}`;

  // ============================================================
  // GENERATE QR CODE
  // ============================================================

  const qrDataUrl =
    await QRCode.toDataURL(
      verifyUrl,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#0a192f',
          light: '#ffffff',
        },
      }
    );

  const qrImageBytes =
    Buffer.from(
      qrDataUrl.split(',')[1],
      'base64'
    );

  const qrImage =
    await pdfDoc.embedPng(
      qrImageBytes
    );

  // ============================================================
  // QR POSITION
  // ============================================================
  //
  // IMPORTANT:
  //
  // This position matches the QR location
  // from the reference certificate image.
  //
  // Template size:
  // 1024 x 683
  //
  // QR:
  // X    = 443
  // Y    = 82
  // Size = 65
  //
  // PDF coordinates start from bottom-left.
  //
  // ============================================================

  const QR_X = 443;
  const QR_Y = 82;
  const QR_SIZE = 65;

  page.drawImage(qrImage, {
    x: QR_X,
    y: QR_Y,
    width: QR_SIZE,
    height: QR_SIZE,
  });

  // ============================================================
  // DATE + CERTIFICATE ID
  // ============================================================

  const dateText = `Date: ${date}`;
  const idText = `ID: ${certificateNumber}`;

  const META_FONT_SIZE = 9;

  const dateWidth =
    timesRomanBoldFont.widthOfTextAtSize(
      dateText,
      META_FONT_SIZE
    );

  const idWidth =
    timesRomanBoldFont.widthOfTextAtSize(
      idText,
      META_FONT_SIZE
    );

  // Center Date and ID exactly under QR

  const qrCenterX =
    QR_X + QR_SIZE / 2;

  // ============================================================
  // DATE
  // ============================================================

  page.drawText(dateText, {
    x:
      qrCenterX -
      dateWidth / 2,

    y: QR_Y - 13,

    size: META_FONT_SIZE,

    font: timesRomanBoldFont,

    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // CERTIFICATE ID
  // ============================================================

  page.drawText(idText, {
    x:
      qrCenterX -
      idWidth / 2,

    y: QR_Y - 26,

    size: META_FONT_SIZE,

    font: timesRomanBoldFont,

    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // SAVE PDF
  // ============================================================

  const pdfBytes =
    await pdfDoc.save();

  return Buffer.from(
    pdfBytes
  );
};