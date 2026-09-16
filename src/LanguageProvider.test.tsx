import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LanguageProvider, useLanguage } from './LanguageProvider';

let mockUser: any = null;
jest.mock('@apollo/client', () => ({
  ...(jest.requireActual('@apollo/client') as any),
  useQuery: () => ({ data: { viewer: { user: mockUser } }, loading: false }),
}));

let container: HTMLDivElement;
let root: Root;
function Probe() {
  return <span>{useLanguage().language}</span>;
}
function renderProvider() {
  act(() => root.render(<LanguageProvider serverLanguage="en"><Probe /></LanguageProvider>));
}

beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockUser = null;
  localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test('server language yields to the signed-in account and follows saved changes/account switching', () => {
  localStorage.setItem('userLanguage', 'cs');
  renderProvider();
  expect(container.textContent).toBe('en');
  mockUser = { id: 'first', language: 'pl' };
  renderProvider();
  expect(container.textContent).toBe('pl');
  expect(document.documentElement.lang).toBe('pl');
  mockUser = { id: 'first', language: 'en' };
  renderProvider();
  expect(container.textContent).toBe('en');
  mockUser = { id: 'second', language: 'cs' };
  renderProvider();
  expect(container.textContent).toBe('cs');
  mockUser = null;
  renderProvider();
  expect(container.textContent).toBe('en');
});

test('stale browser storage never overrides an authenticated user on initial load', () => {
  localStorage.setItem('userLanguage', 'cs');
  mockUser = { id: 'user', language: 'pl' };
  renderProvider();
  expect(container.textContent).toBe('pl');
  expect(localStorage.getItem('userLanguage')).toBe('cs');
});

test('blocked browser storage does not break account language selection', () => {
  const read = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
  const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
  mockUser = { id: 'user', language: 'pl' };
  try {
    renderProvider();
    expect(container.textContent).toBe('pl');
    expect(read).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  } finally {
    read.mockRestore();
    write.mockRestore();
  }
});
