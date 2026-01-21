import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import HrefLink from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';

import { MenuButton } from '../../../components';
import { RESET_PASSWORD_MUTATION } from '../../../gql';
import {
  MIN_PASSWORD_LENGTH,
  useYupValidationResolver,
} from '../../../helpers';
import {
  settingInputStyles,
  labelStyles,
} from '../../../components/commonStyleSheets';
import { validationMessages } from './../messages';

interface PasswordUpdateFormProps {
  id: string;
  token: string;
}

const PasswordUpdateForm = ({ id, token }: PasswordUpdateFormProps) => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(intl.formatMessage(validationMessages.passwordRequired))
      .required(intl.formatMessage(validationMessages.passwordRequired))
      .min(
        MIN_PASSWORD_LENGTH,
        intl.formatMessage(validationMessages.passwordMin, {
          min: MIN_PASSWORD_LENGTH,
        })
      ),
    confirmPassword: Yup.string()
      .required(intl.formatMessage(validationMessages.passwordConfirmation))
      .oneOf(
        [Yup.ref('password')],
        intl.formatMessage(validationMessages.passwordNotMatch)
      ),
  });

  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const { register, handleSubmit } = useForm({ resolver });

  const navigate = useNavigate();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: ({ resetPassword: { __typename, ...data } }) => {
      // console.log(data);
    },
    // onError:
  });

  const onSubmit = async (values: { password: string }) => {
    const { data } = await resetPassword({
      variables: {
        id,
        token,
        newPassword: values.password,
      },
    });

    if (data && !data.resetPassword.errors) {
      navigate('/signin');
    } else {
      setErrors(data!.resetPassword!.errors);
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="column"
      justifyContent="center"
      width="100%"
      boxSizing="border-box"
    >
      <InputLabel htmlFor="password" sx={labelStyles}>
        <FormattedMessage
          id="app.reset.menu.password"
          defaultMessage="New Password"
          description="Reset password new password label"
        />
      </InputLabel>
      <OutlinedInput
        id="password"
        type="password"
        sx={settingInputStyles}
        {...register('password')}
      />
      <InputLabel htmlFor="password" sx={labelStyles}>
        <FormattedMessage
          id="app.reset.menu.passwordagain"
          defaultMessage="Repeat new password"
          description="Reset password repeat new password label"
        />
      </InputLabel>
      <OutlinedInput
        id="confirmPassword"
        type="password"
        sx={settingInputStyles}
        {...register('confirmPassword')}
      />
      <MenuButton loading={loading} type="submit" primary>
        <FormattedMessage
          id="app.reset.menu.change"
          defaultMessage="Change password"
          description="Reset password button text"
        />
      </MenuButton>
      {errors.length > 0 && (
        <Stack my={1} direction="column">
          {errors.map((item: { error: string }, index) => (
            <Typography color="red" key={`error-${index}`}>
              {item.error}
            </Typography>
          ))}
        </Stack>
      )}

      <Stack direction="row" justifyContent="center" my={1}>
        <Typography color="white" fontSize={14}>
          <FormattedMessage
            id="app.reset.menu.backtext"
            defaultMessage="If you didn't intend to reset you password, you can go back"
            description="Reset password go home text"
          />{' '}
          <HrefLink component={Link} color="text.secondary" to="/">
            <FormattedMessage
              id="app.reset.menu.home"
              defaultMessage="Home"
              description="Reset password home link"
            />
          </HrefLink>
        </Typography>
      </Stack>
    </Stack>
  );
};
export { PasswordUpdateForm };
