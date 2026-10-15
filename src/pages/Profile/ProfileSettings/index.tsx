import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

import { LanguageSelector } from '../../../components/LanguageSelector';
import {
  labelStyles,
  settingInputStyles,
} from '../../../components/commonStyleSheets';
import { useYupValidationResolver } from '../../../helpers';
import { AuthQueryName, UPDATE_USER_MUTATION } from '../../../gql';
import { User } from '../../../types';

enum Genders {
  man = 'man',
  woman = 'woman',
  enby = 'enby',
  other = 'other',
}

const getOtherGender = (gender: string) =>
  gender == null ? '' : Genders.other;

const otherGenderInputStyles = { ...settingInputStyles, mt: 2, width: '100%' };
const radioLabelStyles = { color: 'white', cursor: 'pointer' };
const radioStyles = {
  padding: 0,
  '&:hover': { backgroundColor: 'transparent' },
  color: 'grey.500',

  '&.Mui-checked': {
    color: 'primary.main',
  },
};
const alertStyles = { backgroundColor: '#15de46' };
const submitButtonStyles = { flex: 1, color: 'white' };

const ProfileSettings = ({ user }: { user: User | null }) => {
  const intl = useIntl();
  const placeholder = intl.formatMessage({
    id: 'app.settings.menu.specifygender',
    defaultMessage: 'specify (if you like)',
    description: 'specify gender',
  });
  const validationSchema = Yup.object().shape({
    age: Yup.number()
      .notRequired()
      .min(18)
      .max(120)
      .nullable()
      .transform((value) => (!!value ? value : undefined)),
    gender: Yup.string()
      .notRequired()
      .nullable()
      .transform((value) => (!!value ? value : undefined)),
    otherGender: Yup.string().notRequired(),
  });

  const isStandardGender = [Genders.man, Genders.woman, Genders.enby].includes(
    user.gender as Genders
  );
  const initialAge = user.age?.toString() || '';
  const initialGender = isStandardGender
    ? user.gender
    : getOtherGender(user.gender);
  const initialOtherGender = isStandardGender ? '' : user.gender || '';
  const [log, setLog] = useState<boolean | undefined>();
  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver,
    defaultValues: {
      age: initialAge,
      gender: initialGender,
      otherGender: initialOtherGender,
    },
  });
  const watchGender = watch('gender');

  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [AuthQueryName],
    awaitRefetchQueries: true,
    onCompleted: ({ updateUser }) => {
      setLog(updateUser);
      setTimeout(() => setLog(false), 5000);
    },
  });

  const onSubmit = async (values: {
    age?: string;
    gender?: string;
    otherGender?: string;
  }) => {
    setErrors([]);
    let changeSet = {};

    if (typeof values.age !== 'undefined') {
      changeSet = { ...changeSet, age: parseInt(values.age) };
    }
    if (values.gender != null) {
      changeSet = {
        ...changeSet,
        gender:
          values.gender === Genders.other
            ? values.otherGender
            : values.gender,
      };
    }

    await updateUser({ variables: changeSet });
    reset({
      age:
        typeof values.age === 'undefined' ? initialAge : String(values.age),
      gender: values.gender ?? initialGender,
      otherGender: values.otherGender ?? initialOtherGender,
    });
  };

  const onLanguageChange = (language?: string) => {
    if (language && language !== user.language) {
      updateUser({ variables: { language } });
    }
  };

  return (
    <Stack
      width="100%"
      flexGrow={1}
      direction="column"
      boxSizing="border-box"
      px={2}
    >
      <Typography color="text.secondary" my={2}>
        <FormattedMessage
          id="app.settings.menu.anon"
          defaultMessage="All data will be anonymized before evaluation."
          description="Anon text"
        />
      </Typography>
      <InputLabel htmlFor="language" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.language"
          defaultMessage="Language"
          description="Language label"
        />
      </InputLabel>
      <LanguageSelector
        value={user.language}
        onChange={onLanguageChange}
        disabled={loading}
      />

      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        flexGrow={1}
        direction="column"
      >
        <Typography
          color="text.secondary"
          fontSize={18}
          fontWeight={600}
          mt={1}
        >
          <FormattedMessage
            id="app.settings.menu.otherinfo"
            defaultMessage="Additional (voluntary) info"
            description="Otherinfo text"
          />
        </Typography>

        <Box my={3}>
          <InputLabel htmlFor="gender" sx={labelStyles}>
            <FormattedMessage
              id="app.settings.menu.gender"
              defaultMessage="I am..."
              description="Gender label"
            />
          </InputLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                value={field.value ?? ''}
                onChange={(_, value) => field.onChange(value)}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Radio
                    {...register('gender')}
                    id="woman"
                    value="woman"
                    sx={radioStyles}
                  />
                  <InputLabel htmlFor="woman" sx={radioLabelStyles}>
                    <FormattedMessage
                      id="app.settings.menu.woman"
                      defaultMessage="Woman"
                      description="Woman label"
                    />
                  </InputLabel>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Radio
                    {...register('gender')}
                    id="man"
                    value="man"
                    sx={radioStyles}
                  />
                  <InputLabel htmlFor="man" sx={radioLabelStyles}>
                    <FormattedMessage
                      id="app.settings.menu.man"
                      defaultMessage="Man"
                      description="Man label"
                    />
                  </InputLabel>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Radio
                    {...register('gender')}
                    id="enby"
                    value="enby"
                    sx={radioStyles}
                  />
                  <InputLabel htmlFor="enby" sx={radioLabelStyles}>
                    <FormattedMessage
                      id="app.settings.menu.nonbinary"
                      defaultMessage="Nonbinary"
                      description="Nonbinary label"
                    />
                  </InputLabel>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Radio
                    {...register('gender')}
                    id="other"
                    value="other"
                    sx={radioStyles}
                  />
                  <InputLabel htmlFor="other" sx={radioLabelStyles}>
                    <FormattedMessage
                      id="app.settings.menu.othergender"
                      defaultMessage="Other (feel free to specify):"
                      description="Othergender label"
                    />
                  </InputLabel>
                </Stack>
              </RadioGroup>
            )}
          />
          {watchGender === Genders.other && (
            <OutlinedInput
              placeholder={placeholder}
              sx={otherGenderInputStyles}
              {...register('otherGender')}
            />
          )}
        </Box>
        <InputLabel htmlFor="age" sx={labelStyles}>
          <FormattedMessage
            id="app.settings.menu.age"
            defaultMessage="Age:"
            description="Age label"
          />
        </InputLabel>
        <OutlinedInput
          id="age"
          type="number"
          min={18}
          max={120}
          sx={settingInputStyles}
          {...register('age')}
        />

        {errors.length > 0 && (
          <Box>
            {errors.map((item, index) => (
              <Typography color="red" key={`error-${index}`}>
                {item.error}
              </Typography>
            ))}
          </Box>
        )}

        <Stack mt="auto" direction="column" width="100%" mb={2}>
          {log === true && (
            <Stack
              direction="row"
              px={3}
              mb={2}
              height="39px"
              sx={alertStyles}
              alignItems="center"
            >
              <Typography>
                <FormattedMessage
                  id="app.settings.menu.saved"
                  defaultMessage="✓ Settings updated"
                  description="Settingsupdated label"
                />
              </Typography>
            </Stack>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={submitButtonStyles}
            disabled={!isDirty || isSubmitting}
          >
            <FormattedMessage
              id="app.settings.menu.save"
              defaultMessage="Save"
              description="Save label"
            />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { ProfileSettings };
