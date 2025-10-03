import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export interface ParsedItem {
  title: string;
  subtitle?: string;
  date?: string;
}

export interface ParsedResumeData {
  [sectionName: string]: ParsedItem[];
}

export async function parseResumeOnClient(file: File): Promise<ParsedResumeData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('\n');
  }

  const parsedData: ParsedResumeData = {};
  const sectionHeaders = [
    'PROJECTS', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'AWARDS',
    'CERTIFICATIONS', 'PUBLICATIONS', 'INTERNSHIPS', 'HACKATHONS',
    'WORK EXPERIENCE', 'LEADERSHIP'
  ];

  const regex = new RegExp(`^\\s*(${sectionHeaders.join('|')})`, 'gmi');
  const sections: { title: string; startIndex: number; endIndex: number }[] = [];
  
  let match;
  while ((match = regex.exec(fullText)) !== null) {
    sections.push({
      title: match[1].trim().toUpperCase().replace('WORK EXPERIENCE', 'EXPERIENCE'),
      startIndex: match.index,
      endIndex: 0
    });
  }

  for (let i = 0; i < sections.length; i++) {
    sections[i].endIndex = (i + 1 < sections.length) 
      ? sections[i + 1].startIndex 
      : fullText.length;
  }

  for (const section of sections) {
    const sectionContent = fullText.substring(
      section.startIndex + section.title.length,
      section.endIndex
    ).trim();

    parsedData[section.title] = extractStructuredItems(
      section.title, 
      sectionContent
    );
  }

  console.log("Parsed Data:", parsedData);
  return parsedData;
}

function extractStructuredItems(sectionType: string, content: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  
  const blocks = content.split(/\n\s*\n/).filter(block => block.trim().length > 0);

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    if (lines.length === 0) continue;

    const title = lines[0];
    
    const dateMatch = block.match(/\b(20\d{2})\s*[-–—]\s*(20\d{2}|Present)\b/i) 
                   || block.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+20\d{2}/i);
    
    if (sectionType === 'EDUCATION') {
      const degreeInstitution = lines.slice(0, 2).join(' - ');
      items.push({
        title: degreeInstitution,
        date: dateMatch ? dateMatch[0] : undefined
      });
    }
    else if (sectionType === 'PROJECTS') {
      items.push({
        title: lines[0]
      });
    }
    else if (sectionType === 'HACKATHONS') {
      items.push({
        title: lines[0],
        date: dateMatch ? dateMatch[0] : undefined
      });
    }
    else if (sectionType === 'EXPERIENCE' || sectionType === 'INTERNSHIPS') {
      const roleCompany = lines.slice(0, 1).join(' - ');
      items.push({
        title: roleCompany,
        date: dateMatch ? dateMatch[0] : undefined
      });
    }
    else if (sectionType === 'SKILLS') {
      items.push({
        title: lines[0]
      });
    }
    else {
      items.push({
        title: lines[0],
        date: dateMatch ? dateMatch[0] : undefined
      });
    }
  }

  return items.length > 0 ? items : [{ title: content.split('\n')[0] }];
}