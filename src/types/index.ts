export enum UserRole {
  admin = 'admin',
  player = 'player',
}

export interface User {
  email: string;
  role: UserRole;
  age?: number;
  gender?: string;
}
