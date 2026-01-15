import React, { useRef, useState } from 'react';
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

import {
  labelStyles,
  settingInputStyles,
} from '../../../components/commonStyleSheets';
import {
  emailRegex,
  MIN_PASSWORD_LENGTH,
  useYupValidationResolver,
} from '../../../helpers';
import { AuthQueryName, UPDATE_USER_MUTATION } from '../../../gql';
import { User } from '../../../types';
import { validationMessages } from './messages';

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

const Settings = ({ user }: { user: User | null }) => {
  const intl = useIntl();
  const placeholder = intl.formatMessage({
    id: 'app.settings.menu.specifygender',
    defaultMessage: 'specify (if you like)',
    description: 'specify gender',
  });
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .notRequired()
      .matches(emailRegex, intl.formatMessage(validationMessages.emailInvalid))
      .nullable()
      .transform((value) => (!!value ? value : undefined)),
    oldPassword: Yup.string()
      .when('newPassword', ([newPassword], schema: Yup.StringSchema) => {
        if (typeof newPassword === 'string' && newPassword !== '') {
          return schema.required(
            intl.formatMessage(validationMessages.passwordCurrent)
          );
        }
        return schema.notRequired();
      })
      .strict(),
    confirmNewPassword: Yup.string()
      .when('newPassword', ([newPassword], schema: Yup.StringSchema) => {
        if (typeof newPassword === 'string' && newPassword !== '') {
          return schema
            .oneOf(
              [Yup.ref('newPassword')],
              intl.formatMessage(validationMessages.passwordNotMatch)
            )
            .required();
        }
        return schema.notRequired();
      })
      .strict(),
    newPassword: Yup.string()
      .notRequired()
      .min(
        MIN_PASSWORD_LENGTH,
        intl.formatMessage(validationMessages.passwordMin, {
          min: MIN_PASSWORD_LENGTH,
        })
      )
      .nullable()
      .transform((value) => (!!value ? value : undefined)),
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
  });

  const otherGenderInputRef = useRef();
  const [log, setLog] = useState<boolean | undefined>();
  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const { control, register, handleSubmit, watch } = useForm({
    resolver,
    defaultValues: {
      email: user.email,
      oldPassword: '',
      age: user.age || '',
      gender: [Genders.man, Genders.woman, Genders.enby].includes(
        user.gender as Genders
      )
        ? user.gender
        : getOtherGender(user.gender),
    },
  });
  const watchGender = watch('gender');

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [AuthQueryName],
    onCompleted: ({ updateUser }) => {
      setLog(updateUser);
      setTimeout(() => setLog(false), 5000);
    },
  });

  const onSubmit = async (values: {
    email: string;
    oldPassword: string;
    newPassword: string;
    age: string;
    gender: string;
  }) => {
    setErrors([]);
    let changeSet = {};

    if (values.email != null) {
      changeSet = { ...changeSet, email: values.email };
    }
    if (values.newPassword != null) {
      changeSet = {
        ...changeSet,
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
      };
    }
    if (typeof values.age !== 'undefined') {
      changeSet = { ...changeSet, age: parseInt(values.age) };
    }
    if (values.gender != null) {
      changeSet = {
        ...changeSet,
        gender:
          values.gender === 'other'
            ? (otherGenderInputRef.current as any).value
            : values.gender,
      };
    }

    const { data } = await updateUser({
      variables: changeSet,
    });

    if (data && data.updateUser.errors) {
      setErrors(data!.updateUser!.errors);
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
      <Typography color="text.secondary" fontSize={18} fontWeight={600} mt={1}>
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
        {watchGender === 'other' && (
          <OutlinedInput
            ref={otherGenderInputRef}
            placeholder={placeholder}
            defaultValue={
              ![Genders.man, Genders.woman, Genders.enby].includes(
                user.gender as Genders
              )
                ? user.gender
                : undefined
            }
            sx={otherGenderInputStyles}
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
        name="age"
        min={18}
        max={120}
        sx={settingInputStyles}
        {...register('age')}
      />
      <Typography
        color="text.secondary"
        fontSize={18}
        fontWeight={600}
        mt={3}
        mb={2}
      >
        <FormattedMessage
          id="app.settings.menu.settings"
          defaultMessage="Account settings"
          description="Settings header"
        />
      </Typography>
      <InputLabel htmlFor="email" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.email"
          defaultMessage="E-mail"
          description="Email label"
        />
      </InputLabel>
      <OutlinedInput
        id="email"
        type="text"
        placeholder="e-mail"
        sx={settingInputStyles}
        {...register('email')}
      />
      <InputLabel htmlFor="oldPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordcur"
          defaultMessage="Current password"
          description="PasswordCur label"
        />
      </InputLabel>
      <OutlinedInput
        autoComplete="new-password"
        id="oldPassword"
        type="password"
        sx={settingInputStyles}
        {...register('oldPassword')}
      />
      <InputLabel htmlFor="newPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordnew"
          defaultMessage="New password"
          description="PasswordNew label"
        />
      </InputLabel>
      <OutlinedInput
        id="newPassword"
        type="password"
        sx={settingInputStyles}
        {...register('newPassword')}
      />
      <InputLabel htmlFor="confirmNewPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordnew2"
          defaultMessage="Reenter new password"
          description="PasswordNew2 label"
        />
      </InputLabel>
      <OutlinedInput
        id="confirmNewPassword"
        type="password"
        sx={settingInputStyles}
        {...register('confirmNewPassword')}
      />

      {errors.length > 0 && (
        <Box>
          {errors.map((item: { error: string }, index) => (
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
          sx={{ flex: 1, color: 'white' }}
        >
          <FormattedMessage
            id="app.settings.menu.save"
            defaultMessage="Save"
            description="Save label"
          />
        </Button>
      </Stack>
    </Stack>
  );
};

export { Settings };
