export interface User {
  id: string;
  username: string;
  email: string;
  profile: 'iniciante' | 'experiente' | 'administrador';
  avatar?: string | null;
  status: 'ativo' | 'inativo' | 'bloqueado' | 'pendente';
  dateCreated: string;
  dateModified?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  profile: 'iniciante' | 'experiente' | 'administrador';
  token: string;
}

export interface UserStatistics {
  id: string;
  userId: string;
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  totalQuestions: number;
  totalCorrect: number;
  correctPercentage: number;
  categoryStats: CategoryStat[];
  levelStats: LevelStat[];
  averageResponseTime: number;
  quizHistory: QuizHistoryItem[];
  achievements: Achievement[];
  questionsCreated: number;
  questionsApproved: number;
  lastUpdate: string;
  privacySettings: PrivacySettings;
}

export interface CategoryStat {
  category: string;
  totalQuestions: number;
  totalCorrect: number;
  correctPercentage: number;
}

export interface LevelStat {
  level: 'iniciante' | 'intermediário' | 'avançado' | 'expert';
  totalQuestions: number;
  totalCorrect: number;
  correctPercentage: number;
}

export interface QuizHistoryItem {
  sessionId: string;
  date: string;
  score: number;
  totalQuestions: number;
  totalCorrect: number;
  correctPercentage: number;
  gameMode: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  currentLevel: 'bronze' | 'prata' | 'ouro';
  dateObtained: string;
}

export interface PrivacySettings {
  profileVisibility: 'publico' | 'amigos' | 'privado';
  statisticsVisibility: 'publico' | 'amigos' | 'privado';
  achievementsVisibility: 'publico' | 'amigos' | 'privado';
  historyVisibility: 'publico' | 'amigos' | 'privado';
}
