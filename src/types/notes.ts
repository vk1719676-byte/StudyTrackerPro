export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  category: 'lecture' | 'concept' | 'formula' | 'question' | 'summary' | 'flashcard' | 'research';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  examId?: string;
  sessionId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isShared?: boolean;
  sharedWith?: string[];
  attachments?: NoteAttachment[];
  aiInsights?: AIInsight[];
  reviewSchedule?: {
    nextReview: Date;
    difficulty: number;
    reviewCount: number;
  };
}

export interface NoteAttachment {
  id: string;
  type: 'image' | 'pdf' | 'audio' | 'video' | 'link';
  url: string;
  name: string;
  size?: number;
}

export interface AIInsight {
  type: 'summary' | 'keywords' | 'questions' | 'connections';
  content: string;
  confidence: number;
}

export interface NoteTemplate {
  id: string;
  name: string;
  category: StudyNote['category'];
  template: string;
  icon: string;
  description: string;
}

export interface NotesFilter {
  search?: string;
  subjects?: string[];
  categories?: StudyNote['category'][];
  tags?: string[];
  priority?: StudyNote['priority'][];
  examId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
</parameter>
