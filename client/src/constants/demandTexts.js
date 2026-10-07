export const defaultDemandEnglish = [
  "1. Institutional Accountability: Immediate resignation of the MPSC Chairman and secretary; a comprehensive judicial inquiry into the commission's functioning.",
  "2. Examination System Reforms: A definitive decision on the exam pattern (Objective vs Descriptive) and discontinuation of online evaluation systems. Complete abolition of normalization.",
  "3. Recruitment & Vacancies: Immediate declaration and recruitment drive for over 70,000 vacant posts through MPSC only, stopping all private outsourcing.",
  "4. Age Relaxations & Eligibility: An immediate increase in the upper age limit for PSI recruitment and removal of restrictive criteria like TET for specific roles.",
  "5. Financial & Administrative Ease: Implementation of a continuous examination card system (like Rajasthan) and massive reduction of examination fees for struggling students."
];

export const getDemandPoints = (language = 'english', siteConfig = null) => {
  if (siteConfig?.demandEnglish) {
    return siteConfig.demandEnglish.split('\n').filter(p => p.trim());
  }
  return defaultDemandEnglish;
};
