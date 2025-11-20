export interface GeneratedPost {
  hook: string;
  content: string;
  rationale: string;
}

export interface GeneratorResponse {
  styleAnalysis: string;
  posts: GeneratedPost[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}