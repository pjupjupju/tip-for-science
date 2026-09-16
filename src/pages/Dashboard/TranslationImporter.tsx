import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
      <Typography variant="h5" color="white">
        <FormattedMessage id="app.dashboard.translations.title" defaultMessage="Import translations" />
      </Typography>
      <Typography color="text.secondary">
        <FormattedMessage
          id="app.dashboard.translations.description"
          defaultMessage="Select a language tab from the import spreadsheet. Existing translations will be updated and new translations added."
        />
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2}>
        <TextField
          select
          size="small"
          label={<FormattedMessage id="app.dashboard.translations.selectLanguage" defaultMessage="select language" />}
          value={languages.includes(language) ? language : ''}
          disabled={loading || importing || languages.length === 0}
          onChange={event => { setLanguage(event.target.value); reset(); }}
          sx={{
            minWidth: 200,
            '& .MuiInputLabel-root, & .MuiSelect-icon': { color: 'white' },
            '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
              top: '50%',
              transform: 'translate(14px, -50%)',
            },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
              '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
            },
            '& .MuiSelect-select': { py: 0.75 },
            '& .MuiSelect-select.Mui-disabled': { WebkitTextFillColor: '#cacaca' },
          }}
        >
          {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={runImport}
          disabled={loading || importing || !!error || errors.length > 0 || !languages.includes(language)}>
          {importing
            ? <FormattedMessage id="app.dashboard.button.importing" defaultMessage="Importing…" />
            : <FormattedMessage id="app.dashboard.translations.title" defaultMessage="Import translations" />}
        </Button>
        <Button onClick={reload} disabled={loading || importing}>
          {loading
            ? <FormattedMessage id="app.dashboard.translations.loading" defaultMessage="Loading languages…" />
            : <FormattedMessage id="app.dashboard.translations.reload" defaultMessage="Reload languages" />}
        </Button>
      </Stack>
      {error && <Alert severity="error">
        <FormattedMessage id="app.dashboard.translations.loadError" defaultMessage="Could not load languages: {error}" values={{ error: error.message }} />
      </Alert>}
      {errors.map((message, index) => <Alert severity="error" key={index}>
        <FormattedMessage id="app.dashboard.translations.loadError" defaultMessage="Could not load languages: {error}" values={{ error: message }} />
      </Alert>)}
      {!loading && !error && !errors.length && !languages.length &&
        <Alert severity="info">
          <FormattedMessage id="app.dashboard.translations.empty" defaultMessage="No translation tabs found. Add a language tab alongside the import tab." />
        </Alert>}
      {importError && <Alert severity="error">
        <FormattedMessage id="app.dashboard.translations.importError" defaultMessage="Import failed: {error}" values={{ error: importError.message }} />
      </Alert>}
      {result?.success && <Alert severity="success">
        <FormattedMessage
          id="app.dashboard.translations.success"
          defaultMessage="{inserted} translations added; {updated} updated."
          values={{ inserted: result.inserted, updated: result.updated }}
        />
      </Alert>}
      {result?.errors.map((message, index) => <Alert severity="error" key={index}>
        <FormattedMessage id="app.dashboard.translations.importError" defaultMessage="Import failed: {error}" values={{ error: message }} />
      </Alert>)}
    </Stack>
  );
}
