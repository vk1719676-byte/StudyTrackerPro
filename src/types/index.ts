export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPremium?: boolean;
  premiumPlan?: 'monthly' | 'halfyearly' | 'yearly';
  premiumExpiresAt?: Date;
  subscriptionId?: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  popular?: boolean;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  planId: string;
  userId: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  date: Date;
  syllabus: string;
  priority: 'low' | 'medium' | 'high';
  goals: {
    dailyHours: number;
    weeklyHours: number;
    topicProgress: { [topic: string]: number };
  };
  createdAt: Date;
  userId: string;
  aiInsights?: string; // Premium feature
  smartReminders?: boolean; // Premium feature
}

export interface StudySession {
  id: string;
  examId: string;
  duration: number; // in minutes
  subject: string;
  topic: string;
  efficiency: number; // 1-5 rating
  date: Date;
  userId: string;
  notes?: string;
  aiAnalysis?: string; // Premium feature
  focusScore?: number; // Premium feature
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: 'streak' | 'goal' | 'time' | 'exam';
  isPremium?: boolean; // Premium achievements
}

export interface UserStats {
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  completedGoals: number;
  achievements: Achievement[];
  premiumFeatures?: {
    aiInsightsUsed: number;
    advancedAnalyticsViews: number;
    exportCount: number;
  };
}

export interface StudyMaterial {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  examId: string;
  subject: string;
  uploadedAt: Date;
  userId: string;
  tags: string[];
  aiSummary?: string; // Premium feature
  ocrText?: string; // Premium feature
}