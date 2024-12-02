export type CaseType = 'upper' | 'lower' | 'title' | 'sentence';

export const transformCase = (text: string, caseType: CaseType): string => {
  const cleanText = text.replace(/[_-]/g, ' ');
  
  switch (caseType) {
    case 'upper':
      return cleanText.toUpperCase();
    case 'lower':
      return cleanText.toLowerCase();
    case 'title':
      return cleanText
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    case 'sentence':
      return cleanText.charAt(0).toUpperCase() + cleanText.slice(1).toLowerCase();
    default:
      return cleanText;
  }
};
