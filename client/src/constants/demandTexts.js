export const defaultDemandHindi = [
  "१. हमारी मांग है कि एमपीएससी की परीक्षाएं समय पर और पारदर्शी तरीके से आयोजित की जाएं।",
  "२. कृषि सेवा और अन्य परीक्षाओं का कार्यक्रम तुरंत घोषित किया जाए।",
  "३. सरकार विभिन्न विभागों में सभी रिक्त पदों को जल्द से जल्द भरे।",
  "४. हम छात्रों के अधिकारों के लिए एकजुट हैं और न्याय की मांग करते हैं।"
];

export const defaultDemandMarathi = [
  "१. एमपीएससीच्या परीक्षा वेळेवर आणि पारदर्शकपणे घेण्यात याव्यात अशी आमची मागणी आहे.",
  "२. कृषी सेवा आणि इतर परीक्षांचे वेळापत्रक त्वरित जाहीर करण्यात यावे.",
  "३. शासनाने विविध विभागांतील सर्व रिक्त पदे लवकरात लवकर भरावीत.",
  "४. विद्यार्थ्यांच्या हक्कासाठी आम्ही सर्वजण एकत्र उभे आहोत आणि न्यायाची मागणी करत आहोत."
];

export const defaultDemandEnglish = [
  "1. Institutional Accountability: Immediate resignation of the MPSC Chairman and secretary; a comprehensive judicial inquiry into the commission's functioning.",
  "2. Examination System Reforms: A definitive decision on the exam pattern (Objective vs Descriptive) and discontinuation of online evaluation systems. Complete abolition of normalization.",
  "3. Recruitment & Vacancies: Immediate declaration and recruitment drive for over 70,000 vacant posts through MPSC only, stopping all private outsourcing.",
  "4. Age Relaxations & Eligibility: An immediate increase in the upper age limit for PSI recruitment and removal of restrictive criteria like TET for specific roles.",
  "5. Financial & Administrative Ease: Implementation of a continuous examination card system (like Rajasthan) and massive reduction of examination fees for struggling students."
];

export const getDemandPoints = (language, siteConfig) => {
  if (language === 'hindi') {
    if (siteConfig?.demandHindi) {
      return siteConfig.demandHindi.split('\n').filter(p => p.trim());
    }
    return defaultDemandHindi;
  }
  
  if (language === 'marathi') {
    if (siteConfig?.demandMarathi) {
      return siteConfig.demandMarathi.split('\n').filter(p => p.trim());
    }
    return defaultDemandMarathi;
  }
  
  if (siteConfig?.demandEnglish) {
    return siteConfig.demandEnglish.split('\n').filter(p => p.trim());
  }
  return defaultDemandEnglish;
};
