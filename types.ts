
export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, isAdmin?: boolean) => void;
  logout: () => void;
}

export interface ResumeData {
  name: string;
  skills: string[];
  experience: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResult {
  userId: string;
  userName: string;
  score: number;
  timeTaken: number;
  correctAnswers: number;
  totalQuestions: number;
  skills: string[];
}
