import { createContext } from 'react';

const UserContext = createContext<{ user: any; setUser: (user: any) => void }>({
  user: null,
  setUser: (user: any) => {},
});

export { UserContext };
