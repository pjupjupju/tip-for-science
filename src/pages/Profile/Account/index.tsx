import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
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

const alertStyles = { backgroundColor: '#15de46' };
const submitButtonStyles = { flex: 1, color: 'white' };

const Account = ({ user }: { user: User | null }) => {
  const intl = useIntl();
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
  });

  const [log, setLog] = useState<boolean | undefined>();
  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver,
    defaultValues: {
      email: user.email,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [AuthQueryName],
    awaitRefetchQueries: true,
    onCompleted: ({ updateUser }) => {
      setLog(updateUser);
      setTimeout(() => setLog(false), 5000);
    },
  });

  const onSubmit = async (values: {
    email?: string;
    oldPassword: string;
    newPassword?: string;
    confirmNewPassword: string;
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

    await updateUser({ variables: changeSet });
    reset({
      email: values.email ?? user.email,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
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
  );
};

export { Account };
