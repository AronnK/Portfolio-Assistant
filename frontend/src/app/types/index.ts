export interface ParsedItem {
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }
  
  export interface ParsedResumeData {
    [sectionName: string]: ParsedItem[];
  }
  