export interface User {
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface CoupleSettings {
  creationDate: string;
  anniversaryDate: string;
  biometricEnabled: boolean;
  disappearingMessagesDuration: string;
  screenshotLog: { user: string; timestamp: string; type: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'leo' | 'luna';
  text: string;
  timestamp: string;
  isPinned: boolean;
  isDisappearing: boolean;
  timeLeft?: number; // for frontend countdowns
}

export interface Comment {
  id: string;
  sender: 'leo' | 'luna';
  text: string;
  timestamp: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  uploader: 'leo' | 'luna';
  imageUrl: string;
  reactions: {
    heart: number;
    hug: number;
    kiss: number;
  };
  comments: Comment[];
}

export interface Rule {
  id: string;
  text: string;
  category: string;
  createdBy: 'leo' | 'luna';
  approvedByLeo: boolean;
  approvedByLuna: boolean;
  status: 'approved' | 'pending_approval';
  lastUpdated: string;
}

export interface SavingContribution {
  id: string;
  contributor: 'leo' | 'luna';
  amount: number;
  date: string;
  description: string;
}

export interface SavingGoal {
  targetAmount: number;
  currentSavings: number;
  contributions: SavingContribution[];
}

export interface FutureGoal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  isCompleted: boolean;
  description: string;
}

export interface MoodState {
  emoji: string;
  label: string;
  timestamp: string;
  text: string;
}

export interface FullState {
  users: {
    leo: User;
    luna: User;
  };
  settings: CoupleSettings;
  messages: ChatMessage[];
  memories: Memory[];
  rules: Rule[];
  finances: SavingGoal;
  goals: FutureGoal[];
  moods: Record<'leo' | 'luna', MoodState | null>;
}
