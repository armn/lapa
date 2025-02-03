export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  hint: string;
}

export interface WritingStats {
  currentWordCount: number;
  totalWordCount: number;
  streak: number;
  lastWriteDate: Date | null;
  deletions: number;
  sessionsCompleted: number;
  totalTimeSpent: number;
}

export interface SavedText {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  timeSpent: number;
}