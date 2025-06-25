// Speak Service API Types

export interface Speak {
  _id: string;
  title: string;
  userId: string;
  modeId: string;
  scenarioId: string;
  personalityId: string;
  levelId: string;
  hasMessage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpeakListResponse {
  speaks: Speak[];
  total: number;
  page: number;
  limit: number;
}

export interface AddSpeakRequest {
  mode_id: string;
  scenario_id: string;
  personality_id: string;
  level_id: string;
} 