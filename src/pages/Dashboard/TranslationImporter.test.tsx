import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { fireEvent, getByRole } from '@testing-library/dom';
import { IntlProvider } from 'react-intl';
import { TranslationImporter } from './TranslationImporter';
import csMessages from '../../translations/cs.json';

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
const render = (locale = 'en') => act(() => root.render(
  <IntlProvider locale={locale} defaultLocale="en" messages={locale === 'cs' ? csMessages : {}}>
    <TranslationImporter />
  </IntlProvider>
));

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

test('Czech locale translates controls, progress, results and error messages', () => {
  render('cs');
  expect(getByRole(container, 'combobox', { name: 'vyber jazyk' })).toBeTruthy();
  expect(getByRole(container, 'button', { name: 'Import překladů' })).toBeTruthy();
  expect(getByRole(container, 'button', { name: 'Znovu načíst jazyky' })).toBeTruthy();

  mockQuery.loading = true;
  render('cs');
  expect(getByRole(container, 'button', { name: 'Načítání jazyků…' })).toBeTruthy();
  mockQuery.loading = false;
  mockMutation.loading = true;
  render('cs');
  expect(getByRole(container, 'button', { name: 'Importování…' })).toBeTruthy();

  mockMutation.loading = false;
  mockMutation.data = { importTranslations: { success: true, inserted: 2, updated: 1, errors: [] } };
  render('cs');
  expect(container.textContent).toContain('Přidáno překladů: 2; aktualizováno: 1.');

  mockQuery.error = new Error('Network unavailable');
  mockMutation.error = new Error('Access denied');
  render('cs');
  expect(container.textContent).toContain('Jazyky se nepodařilo načíst: Network unavailable');
  expect(container.textContent).toContain('Import se nezdařil: Access denied');

  mockQuery.error = undefined;
  mockQuery.data.getTranslationImportLanguages.languages = [];
  render('cs');
  expect(container.textContent).toContain('Nebyly nalezeny žádné jazykové listy.');
});
