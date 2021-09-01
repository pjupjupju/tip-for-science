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

export { getItem, setItem };
