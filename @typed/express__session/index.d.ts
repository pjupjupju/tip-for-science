import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    token: string;
  }
}

export {};

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}
