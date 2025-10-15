export interface ParsedItem {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface ParsedResumeData {
  [sectionName: string]: ParsedItem[];
}

export interface ChatbotData {
  id: number;
  user_id: string;
  collection_name: string;
  project_name: string;
  llm_provider: string | null;
  encrypted_api_key: string | null;
  status: string;
  created_at: string;
  last_updated: string;
}

export interface UpdateFormData {
  title: string;
  details: string;
  type: 'education' | 'project' | 'internship' | 'experience' | 'other';
}
