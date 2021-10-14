const getItem = (key: string) => {
  if (typeof localStorage.getItem !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};
const setItem = (key: string, value: string) => {
  if (typeof localStorage.setItem !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeItem = (key: string) => {
  if (typeof localStorage.removeItem !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export { getItem, setItem, removeItem };
