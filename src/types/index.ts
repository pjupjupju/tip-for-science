export enum UserRole {
  admin = 'admin',
  player = 'player',
}

export interface User {
  role: UserRole;
}
