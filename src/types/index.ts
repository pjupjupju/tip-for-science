export enum UserRole {
  admin = 'admin',
  player = 'player',
}

export interface User {
  email: string;
  role: UserRole;
  slug: string;
  age?: number;
  gender?: string;
  nextQuestionnaireAfterQuestion?: string;
  isQuestionnaireActive?: boolean;
}
