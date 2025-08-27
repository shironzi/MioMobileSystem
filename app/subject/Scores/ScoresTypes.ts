export interface ActivityItem {
  activityId: string;
  title: string;
}

export interface SpecializedActivity {
  activityType: string;
  difficulty: string;
  activities: ActivityItem[];
}

export interface Student {
  studentId: string;
  name: string;
}

export interface Feedback {
  id: string;
  feedback: string;
  audio: string;
  phonemes: {
    phone: string;
    quality_score: number;
    sound_most_like: string;
  }[];
  word: string;
  score: number;
}

export interface Attempt {
  attemptId: string;
  score: number;
  submitted_at: string;
}
