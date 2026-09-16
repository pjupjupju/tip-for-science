import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IMPORT_TRANSLATIONS_MUTATION } from '../../gql/importTranslationsMutation';
import { GET_TRANSLATION_IMPORT_LANGUAGES_QUERY } from '../../gql/getTranslationImportLanguagesQuery';

type ImportResult = { success: boolean; inserted: number; updated: number; errors: string[] };

export function TranslationImporter() {
  const [language, setLanguage] = useState('');
  const { data, loading, error, refetch } = useQuery<{
    getTranslationImportLanguages: { languages: string[]; errors: string[] };
  }>(GET_TRANSLATION_IMPORT_LANGUAGES_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [importTranslations, { data: imported, loading: importing, error: importError, reset }] =
    useMutation<{ importTranslations: ImportResult }>(IMPORT_TRANSLATIONS_MUTATION);
  const languages = data?.getTranslationImportLanguages.languages || [];
  const errors = data?.getTranslationImportLanguages.errors || [];
  const result = imported?.importTranslations;

  const runImport = async () => {
    if (!languages.includes(language) || importing) return;
    try {
      await importTranslations({ variables: { lang: language } });
    } catch {
      // Apollo exposes network/authorization failures through importError below.
    }
  };

  const reload = async () => {
    setLanguage('');
    reset();
    try {
      await refetch();
    } catch {
      // Query failures are displayed below and can be retried.
    }
  };

  return (
    <Stack gap={2} my={3}>
      <Typography variant="h5" color="white">Import translations</Typography>
      <Typography color="text.secondary">
        Select a language tab from the import spreadsheet. Existing translations will be updated and new translations added.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <TextField
          select
          label="Language tab"
          value={languages.includes(language) ? language : ''}
          disabled={loading || importing || languages.length === 0}
          onChange={event => { setLanguage(event.target.value); reset(); }}
          sx={{ minWidth: 200 }}
        >
          {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={runImport}
          disabled={loading || importing || !!error || errors.length > 0 || !languages.includes(language)}>
          {importing ? 'Importing…' : 'Import translations'}
        </Button>
        <Button onClick={reload} disabled={loading || importing}>
          {loading ? 'Loading languages…' : 'Reload languages'}
        </Button>
      </Stack>
      {error && <Alert severity="error">Could not load languages: {error.message}</Alert>}
      {errors.map((message, index) => <Alert severity="error" key={index}>{message}</Alert>)}
      {!loading && !error && !errors.length && !languages.length &&
        <Alert severity="info">No translation tabs found. Add a language tab alongside the import tab.</Alert>}
      {importError && <Alert severity="error">Import failed: {importError.message}</Alert>}
      {result?.success && <Alert severity="success">
        {result.inserted} translations added; {result.updated} updated.
      </Alert>}
      {result?.errors.map((message, index) => <Alert severity="error" key={index}>{message}</Alert>)}
    </Stack>
  );
}
