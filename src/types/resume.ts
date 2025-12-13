// Personal detail interface
export interface PersonalDetail {
  fullName: string;
  email: string;
  phone: string;
  headline?: string; // Optional field
  address?: string;  // Optional field
  photoUrl?: string; // Optional field
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
}

// Specific item interfaces
export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string; // Format: YYYY-MM
  endDate?: string;  // Format: YYYY-MM, optional for current position
  description: string;
  city?: string;
  country?: string;
  currentlyWorking: boolean; // Indicates if this is the current job
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string; // Format: YYYY-MM
  endDate?: string;  // Format: YYYY-MM
  description?: string;
  city?: string;
  country?: string;
  gpa?: string;
  coursework?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string; // Optional category grouping
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  startDate: string; // Format: YYYY-MM
  endDate?: string;  // Format: YYYY-MM
  url?: string;
  technologies?: string[];
  achievements?: string[];
}

// Base interface for resume sections
export interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'custom' | 'projects';
  title: string;
  isVisible: boolean;
  columns: 1 | 2; // Allow only 1 or 2 columns
  items: Array<ExperienceItem | EducationItem | SkillItem | ProjectItem>;
}

// Root interface for the resume content stored in the DB
export interface ResumeContent {
  personalDetail: PersonalDetail;
  sections: ResumeSection[];
}