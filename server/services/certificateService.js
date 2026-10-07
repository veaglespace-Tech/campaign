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
  // CERTIFICATE BACKGROUND & BORDERS
  // ============================================================

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Outer Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.88, 0.11, 0.28), // Crimson
    borderWidth: 4,
    color: rgb(1, 1, 1),
  });

  // Inner Border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.95, 0.6, 0.2), // Orange
    borderWidth: 1,
  });

  // ============================================================
  // TITLE
  // ============================================================
  const titleText = "CERTIFICATE OF SUPPORT";
  const titleSize = 42;
  const titleWidth = timesRomanBoldFont.widthOfTextAtSize(titleText, titleSize);
  
  page.drawText(titleText, {
    x: width / 2 - titleWidth / 2,
    y: height - 120,
    size: titleSize,
    font: timesRomanBoldFont,
    color: rgb(0.05, 0.05, 0.05),
  });

  const subtitleText = "MPSC STUDENTS PROTEST";
  const subtitleSize = 24;
  const subtitleWidth = timesRomanBoldFont.widthOfTextAtSize(subtitleText, subtitleSize);
  
  page.drawText(subtitleText, {
    x: width / 2 - subtitleWidth / 2,
    y: height - 160,
    size: subtitleSize,
    font: timesRomanBoldFont,
    color: rgb(0.88, 0.11, 0.28),
  });

  // ============================================================
  // CERTIFICATE AREA
  // ============================================================

  const CERT_LEFT = 100;
  const CERT_RIGHT = width - 100;

  const CERT_CENTER_X = width / 2;

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
    color: rgb(0.05, 0.05, 0.05),
  });
  
  // Underline for name
  page.drawLine({
    start: { x: width / 2 - 250, y: NAME_Y - 10 },
    end: { x: width / 2 + 250, y: NAME_Y - 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  const presentedToText = "Proudly presented to";
  const pWidth = timesRomanFont.widthOfTextAtSize(presentedToText, 16);
  page.drawText(presentedToText, {
    x: width / 2 - pWidth / 2,
    y: NAME_Y + 40,
    size: 16,
    font: timesRomanFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // ============================================================
  // DEMANDS
  // ============================================================
  
  const pledgeEnglish = config?.pledgeEnglish || `1. We demand that the MPSC exams be conducted fairly and transparently without any delays.\n2. We strongly demand the immediate announcement of the exam schedule for Agriculture Services and other exams.\n3. We demand that the government immediately fill all vacant positions in various departments.\n4. We stand united for the rights of all students and demand justice.`;
  const pledgeMarathi = config?.pledgeMarathi || `१. एमपीएससीच्या परीक्षा वेळेवर आणि पारदर्शकपणे घेण्यात याव्यात अशी आमची मागणी आहे.\n२. कृषी सेवा आणि इतर परीक्षांचे वेळापत्रक त्वरित जाहीर करण्यात यावे.\n३. शासनाने विविध विभागांतील सर्व रिक्त पदे लवकरात लवकर भरावीत.\n४. विद्यार्थ्यांच्या हक्कासाठी आम्ही सर्वजण एकत्र उभे आहोत आणि न्यायाची मागणी करत आहोत.`;
  const pledgeHindi = config?.pledgeHindi || `१. हमारी मांग है कि एमपीएससी की परीक्षाएं समय पर और पारदर्शी तरीके से आयोजित की जाएं।\n२. कृषि सेवा और अन्य परीक्षाओं का कार्यक्रम तुरंत घोषित किया जाए।\n३. सरकार विभिन्न विभागों में सभी रिक्त पदों को जल्द से जल्द भरे।\n४. हम छात्रों के अधिकारों के लिए एकजुट हैं और न्याय की मांग करते हैं।`;

  let demandsText = pledgeEnglish; // Force English to prevent PDF unicode errors with indic scripts

  let currentY = NAME_Y - 50;
  
  const demandsTitle = 'Our Demands:';
  const dTitleWidth = timesRomanBoldFont.widthOfTextAtSize(demandsTitle, 16);
  
  page.drawText(demandsTitle, {
    x: width / 2 - dTitleWidth / 2,
    y: currentY,
    size: 16,
    font: timesRomanBoldFont,
    color: rgb(0.88, 0.11, 0.28),
  });
  
  currentY -= 25;

  const demandsLines = demandsText.split('\n').filter(line => line.trim() !== '');
  for (const line of demandsLines) {
    const words = line.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine === '' ? word : currentLine + ' ' + word;
      const testWidth = nameFont.widthOfTextAtSize(testLine, 12); // Reduced from 14 to 12
      if (testWidth > 750) { // Increased wrap width from 700 to 750
        const lw = nameFont.widthOfTextAtSize(currentLine, 12);
        page.drawText(currentLine, { x: width / 2 - lw / 2, y: currentY, size: 12, font: nameFont, color: rgb(0.2, 0.2, 0.2) });
        currentLine = word;
        currentY -= 16; // Reduced spacing
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine !== '') {
      const lw = nameFont.widthOfTextAtSize(currentLine, 12);
      page.drawText(currentLine, { x: width / 2 - lw / 2, y: currentY, size: 12, font: nameFont, color: rgb(0.2, 0.2, 0.2) });
      currentY -= 22; // Reduced paragraph spacing
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

  const QR_SIZE = 80;
  const QR_X = width / 2 - QR_SIZE / 2;
  const QR_Y = 60;

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
    x: 100,
    y: 80,
    size: META_FONT_SIZE,
    font: timesRomanBoldFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // ============================================================
  // CERTIFICATE ID
  // ============================================================

  page.drawText(idText, {
    x: width - 100 - idWidth,
    y: 80,
    size: META_FONT_SIZE,
    font: timesRomanBoldFont,
    color: rgb(0.4, 0.4, 0.4),
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