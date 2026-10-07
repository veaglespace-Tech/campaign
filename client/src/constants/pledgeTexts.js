export const defaultPledgeHindi = [
  "१. हमारी मांग है कि एमपीएससी की परीक्षाएं समय पर और पारदर्शी तरीके से आयोजित की जाएं।",
  "२. कृषि सेवा और अन्य परीक्षाओं का कार्यक्रम तुरंत घोषित किया जाए।",
  "३. सरकार विभिन्न विभागों में सभी रिक्त पदों को जल्द से जल्द भरे।",
  "४. हम छात्रों के अधिकारों के लिए एकजुट हैं और न्याय की मांग करते हैं।"
];

export const defaultPledgeMarathi = [
  "१. एमपीएससीच्या परीक्षा वेळेवर आणि पारदर्शकपणे घेण्यात याव्यात अशी आमची मागणी आहे.",
  "२. कृषी सेवा आणि इतर परीक्षांचे वेळापत्रक त्वरित जाहीर करण्यात यावे.",
  "३. शासनाने विविध विभागांतील सर्व रिक्त पदे लवकरात लवकर भरावीत.",
  "४. विद्यार्थ्यांच्या हक्कासाठी आम्ही सर्वजण एकत्र उभे आहोत आणि न्यायाची मागणी करत आहोत."
];

export const defaultPledgeEnglish = [
  "1. We demand that the MPSC exams be conducted fairly and transparently without any delays.",
  "2. We strongly demand the immediate announcement of the exam schedule for Agriculture Services and other exams.",
  "3. We demand that the government immediately fill all vacant positions in various departments.",
  "4. We stand united for the rights of all students and demand justice."
];

export const getPledgePoints = (language, siteConfig) => {
  if (language === 'hindi') {
    if (siteConfig?.pledgeHindi) {
      return siteConfig.pledgeHindi.split('\n').filter(p => p.trim());
    }
    return defaultPledgeHindi;
  }
  
  if (language === 'marathi') {
    if (siteConfig?.pledgeMarathi) {
      return siteConfig.pledgeMarathi.split('\n').filter(p => p.trim());
    }
    return defaultPledgeMarathi;
  }
  
  if (siteConfig?.pledgeEnglish) {
    return siteConfig.pledgeEnglish.split('\n').filter(p => p.trim());
  }
  return defaultPledgeEnglish;
};
