import { defineMessages } from 'react-intl';

export const validationMessages = defineMessages({
  emailRequired: {
    id: 'app.signup.validation.emailrequired',
    defaultMessage: 'E-mail is required',
  },
  emailInvalid: {
    id: 'app.signup.validation.emailinvalid',
    defaultMessage: 'Please enter a valid e-mail',
  },
  passwordRequired: {
    id: 'app.signup.validation.pwdrequired',
    defaultMessage: 'Password is required',
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
