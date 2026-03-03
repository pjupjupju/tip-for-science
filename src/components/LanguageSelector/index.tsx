import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { grey } from '@mui/material/colors';
import { GET_LANGUAGES_QUERY } from '../../gql';
import { LanguageOption } from '../../types';

const slotProps = {
  paper: {
    sx: {
      backgroundColor: '#161616',
      color: grey[100],
      borderRadius: 0,
    },
  },
  listbox: {
    sx: {
      backgroundColor: '#161616',
      color: grey[100],
      '& .MuiAutocomplete-option': {
        color: grey[100],
        '&:hover': {
          backgroundColor: grey[900],
        },
        '&[aria-selected="true"]': {
          backgroundColor: grey[900],
        },
        '&[aria-selected="true"].Mui-focused': {
          backgroundColor: grey[900],
        },
        '&.Mui-focused': {
          backgroundColor: grey[900],
        },
        '&.Mui-focusVisible': {
          backgroundColor: grey[900],
        },
      },
    },
  },
};

const languageSelectorStyles = {
  mb: 1,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#161616',
    color: grey[100],
    borderRadius: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
      borderWidth: '1px',
      borderRadius: 0,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
  },
  '& .MuiOutlinedInput-input': {
    borderRadius: 0,
    padding: '8px 10px',
    '&::placeholder': {
      color: grey[100],
      opacity: 1,
    },
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: grey[100],
  },
  '& .MuiAutocomplete-clearIndicator': {
    color: grey[100],
  },
};

type LanguageSelectorProps = {
  value?: string;
  onChange: (language?: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

type GetLanguagesResponse = {
  getLanguages: LanguageOption[];
};

function LanguageSelector({
  value,
  onChange,
  disabled = false,
  placeholder = 'language',
}: LanguageSelectorProps) {
  const { data, loading } = useQuery<GetLanguagesResponse>(GET_LANGUAGES_QUERY);
  const options = data?.getLanguages || [];

  const selectedOption = useMemo(
    () => options.find((option) => option.lang === value) || null,
    [options, value]
  );

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(_, option) => onChange(option?.lang)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      freeSolo={false}
      disabled={disabled}
      loading={loading}
      sx={languageSelectorStyles}
      slotProps={slotProps}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export { LanguageSelector };
