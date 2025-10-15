export type LLMProvider = "google" | "openai" | "groq";

export interface ParsedItem {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface ParsedResumeData {
  personal_details?: {
    name?: string;
    email?: string;
    phone?: string;
    links?: { type: string; url: string }[];
  };
  summary?: string;
  EDUCATION?: ParsedItem[];
  EXPERIENCE?: ParsedItem[];
  PROJECTS?: ParsedItem[];
  SKILLS?: ParsedItem[];
  CERTIFICATIONS?: ParsedItem[];
  [section: string]: ParsedItem[] | string | Record<string, unknown> | undefined;
}

export interface ChatbotData {
  id: number;
  created_at: string;
  user_id: string;
  collection_name: string;
  llm_provider: LLMProvider | string | null;
  encrypted_api_key: string | null;
  project_name: string | null;
  status: string | null;
  last_updated: string | null;
}

export interface UpdateFormData {
  title: string;
  details: string;
  type: 'education' | 'project' | 'internship' | 'experience' | 'other';
}
