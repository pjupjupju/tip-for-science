import { defineMessages } from 'react-intl';

export const validationMessages = defineMessages({
  emailInvalid: {
    id: 'app.signup.validation.emailinvalid',
    defaultMessage: 'Please enter a valid e-mail',
  },
  passwordCurrent: {
    id: 'app.signup.validation.pwdcurrent',
    defaultMessage: 'Current password is required to change the password',
  },
  passwordConfirmation: {
    id: 'app.signup.validation.pwdconfirmation',
    defaultMessage: 'Please confirm the password',
  },
  passwordNotMatch: {
    id: 'app.signup.validation.pwdnotmatch',
    defaultMessage: 'Passwords do not match',
  },
  passwordMin: {
    id: 'validation.passwordMin',
    defaultMessage: 'Password must be at least {min} characters',
  },
});
