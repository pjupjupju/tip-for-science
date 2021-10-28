/**
 * User from db
 */
 export interface User {
  createdAt: string;
  id: string;
  userskey: string;
  email: string;
  name?: string | void;
  password: string;
  role: UserRole;
  slug: string;
  score: number;
  /**
   * ISO 8601 DateTime
   */
  updatedAt: string;
}

/**
 * User roles
 */
export enum UserRole {
  admin = 'admin',
  player = 'player',
}
