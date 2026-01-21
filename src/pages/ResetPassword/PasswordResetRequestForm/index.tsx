import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import HrefLink from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';

import { MenuButton } from '../../../components';
import { REQUEST_PASSWORD_RESET_MUTATION } from '../../../gql';
import { emailRegex, useYupValidationResolver } from '../../../helpers';
import {
  settingInputStyles,
  labelStyles,
} from '../../../components/commonStyleSheets';
import { validationMessages } from './../messages';

const PasswordResetRequestForm = () => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(intl.formatMessage(validationMessages.emailRequired))
      .matches(emailRegex, intl.formatMessage(validationMessages.emailInvalid)),
  });

  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Array<{ error: string }>>([]);
  const resolver = useYupValidationResolver(validationSchema, setErrors);
  const { register, handleSubmit } = useForm({ resolver });

  const [requestPasswordReset, { loading }] = useMutation(
    REQUEST_PASSWORD_RESET_MUTATION,
    {
      onCompleted: ({ requestPasswordReset: { __typename, ...data } }) => {
        // console.log(data);
      },
      // onError:
    }
  );

  const onSubmit = async (values: { email: string }) => {
    const { data } = await requestPasswordReset({
      variables: {
        email: values.email,
      },
    });

    if (data && !data.requestPasswordReset.errors) {
      setIsComplete(true);
    } else {
      setErrors(data!.requestPasswordReset!.errors);
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
      {isComplete ? (
        <>
          <Stack direction="row" justifyContent="center" my={3}>
            <Typography color="white">
              <FormattedMessage
                id="app.reset.menu.sent"
                defaultMessage="Password reset request successfully sent. You can return to"
                description="Password reset request sent text"
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
        </>
      ) : (
        <>
          <Stack
            direction="column"
            justifyContent="center"
            boxSizing="border-box"
            width="100%"
            marginBottom={3}
          >
            <InputLabel htmlFor="email" sx={labelStyles}>
              <FormattedMessage
                id="app.reset.menu.email"
                defaultMessage="E-mail"
                description="Request reset password email label"
              />
            </InputLabel>
            <OutlinedInput
              id="email"
              type="text"
              placeholder="e-mail"
              sx={settingInputStyles}
              {...register('email')}
            />
          </Stack>
          <MenuButton loading={loading} type="submit" primary>
            <FormattedMessage
              id="app.reset.menu.request"
              defaultMessage="Request password reset"
              description="Request password change button text"
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
        </>
      )}
    </Stack>
  );
};
export { PasswordResetRequestForm };
