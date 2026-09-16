import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { fireEvent, getByRole } from '@testing-library/dom';
import { TranslationImporter } from './TranslationImporter';

let mockQuery: any;
let mockMutation: any;
const mockImport = jest.fn();
jest.mock('@apollo/client', () => ({
  ...(jest.requireActual('@apollo/client') as any),
  useQuery: () => mockQuery,
  useMutation: () => [mockImport, mockMutation],
}));

let container: HTMLDivElement;
let root: Root;
const render = () => act(() => root.render(<TranslationImporter />));

beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockQuery = { data: { getTranslationImportLanguages: { languages: ['en', 'pl'], errors: [] } }, refetch: jest.fn().mockResolvedValue({}) };
  mockMutation = { reset: jest.fn() };
  mockImport.mockReset().mockResolvedValue({});
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => { act(() => root.unmount()); container.remove(); });

test('import requires a selection, submits that language and displays result/errors', async () => {
  render();
  const button = getByRole(container, 'button', { name: 'Import translations' }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  act(() => fireEvent.mouseDown(getByRole(container, 'combobox')));
  act(() => fireEvent.click(getByRole(document.body, 'option', { name: 'pl' })));
  expect(button.disabled).toBe(false);
  await act(async () => { fireEvent.click(button); });
  expect(mockImport).toHaveBeenCalledWith({ variables: { lang: 'pl' } });
  mockMutation = { ...mockMutation, data: { importTranslations: { success: true, inserted: 2, updated: 1, errors: [] } } };
  render();
  expect(container.textContent).toContain('2 translations added; 1 updated.');
  mockMutation = { ...mockMutation, data: { importTranslations: { success: false, inserted: 0, updated: 0, errors: ['Question ID 99: not found'] } } };
  render();
  expect(container.textContent).toContain('Question ID 99: not found');
  act(() => fireEvent.click(getByRole(container, 'button', { name: 'Reload languages' })));
  expect(button.disabled).toBe(true);
});

test('sheet errors are visible and prevent imports', () => {
  mockQuery.data.getTranslationImportLanguages = { languages: [], errors: ['Spreadsheet unavailable'] };
  render();
  expect(container.textContent).toContain('Spreadsheet unavailable');
  expect((getByRole(container, 'button', { name: 'Import translations' }) as HTMLButtonElement).disabled).toBe(true);
});
