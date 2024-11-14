import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Label, Radio } from '@rebass/forms';
import { Flex, Text, Box } from 'rebass';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import {
  inputStyles,
  labelStyles,
} from '../../../components/commonStyleSheets';
import {
  emailRegex,
  MIN_PASSWORD_LENGTH,
  useYupValidationResolver,
} from '../../../helpers';
import { useMutation } from '@apollo/client';
import { AuthQueryName, UPDATE_USER_MUTATION } from '../../../gql';
import { User } from '../../../types';
import Button from '@mui/material/Button';
import { validationMessages } from './messages';

enum Genders {
  man = 'man',
  woman = 'woman',
  enby = 'enby',
  other = 'other',
}

const getOtherGender = (gender: string) =>
  gender == null ? '' : Genders.other;

const otherGenderInputStyles = { ...inputStyles, mt: 2 };
const radioLabelStyles = { ...labelStyles, mb: 2 };

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
    oldPassword: Yup.mixed()
      .when('newPassword', ([newPassword, schema]) => {
        return newPassword !== '' && newPassword != null
          ? schema
              .string()
              .required(intl.formatMessage(validationMessages.passwordCurrent))
          : schema.mixed().notRequired();
      })
      .strict(),
    confirmNewPassword: Yup.mixed()
      .when('newPassword', ([confirmNewPassword, schema]) => {
        return confirmNewPassword !== '' && confirmNewPassword != null
          ? schema
              .string()
              .oneOf(
                [Yup.ref('newPassword')],
                intl.formatMessage(validationMessages.passwordNotMatch)
              )
              .required()
          : schema.mixed().notRequired();
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
  const { register, handleSubmit, watch } = useForm({
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
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      width="100%"
      flexGrow={1}
      flexDirection="column"
    >
      <Text color="secondary" my={3}>
        <FormattedMessage
          id="app.settings.menu.anon"
          defaultMessage="All data will be anonymized before evaluation."
          description="Anon text"
        />
      </Text>
      <Text color="secondary" fontSize={3} mt={1} px={3}>
        <FormattedMessage
          id="app.settings.menu.otherinfo"
          defaultMessage="Additional (voluntary) info"
          description="Otherinfo text"
        />
      </Text>

      <Box my={3}>
        <Label htmlFor="gender" sx={radioLabelStyles}>
          <FormattedMessage
            id="app.settings.menu.gender"
            defaultMessage="I am..."
            description="Gender label"
          />
        </Label>
        <Label color="white">
          <Radio
            {...register('gender')}
            name="gender"
            id="woman"
            value="woman"
          />
          <FormattedMessage
            id="app.settings.menu.woman"
            defaultMessage="Woman"
            description="Woman label"
          />
        </Label>
        <Label color="white">
          <Radio {...register('gender')} name="gender" id="man" value="man" />
          <FormattedMessage
            id="app.settings.menu.man"
            defaultMessage="Man"
            description="Man label"
          />
        </Label>
        <Label color="white">
          <Radio {...register('gender')} name="gender" id="enby" value="enby" />
          <FormattedMessage
            id="app.settings.menu.nonbinary"
            defaultMessage="Nonbinary"
            description="Nonbinary label"
          />
        </Label>
        <Label color="white">
          <Radio
            {...register('gender')}
            name="gender"
            id="other"
            value="other"
          />
          <FormattedMessage
            id="app.settings.menu.othergender"
            defaultMessage="Other (feel free to specify):"
            description="Othergender label"
          />
        </Label>
        {watchGender === 'other' && (
          <Input
            ref={otherGenderInputRef}
            placeholder={placeholder}
            mb="2"
            defaultValue={user.gender}
            sx={otherGenderInputStyles}
          />
        )}
      </Box>
      <Label htmlFor="age" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.age"
          defaultMessage="Age:"
          description="Age label"
        />
      </Label>
      <Input
        id="age"
        type="number"
        name="age"
        min={18}
        max={120}
        mb={2}
        sx={inputStyles}
        {...register('age')}
      />
      {errors.length > 0 && (
        <Box>
          {errors.map((item: { error: string }, index) => (
            <Text color="red" key={`error-${index}`}>
              {item.error}
            </Text>
          ))}
        </Box>
      )}
      <Text color="secondary" fontSize={3} mt={4} mb={3} px={3}>
        <FormattedMessage
          id="app.settings.menu.settings"
          defaultMessage="Account settings"
          description="Settings header"
        />
      </Text>
      <Label htmlFor="email" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.email"
          defaultMessage="E-mail"
          description="Email label"
        />
      </Label>
      <Input
        id="email"
        type="text"
        placeholder="e-mail"
        mb={2}
        sx={inputStyles}
        {...register('email')}
      />
      <Label htmlFor="oldPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordcur"
          defaultMessage="Current password"
          description="PasswordCur label"
        />
      </Label>
      <Input
        autoComplete="new-password"
        id="oldPassword"
        type="password"
        mb={2}
        sx={inputStyles}
        {...register('oldPassword')}
      />
      <Label htmlFor="newPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordnew"
          defaultMessage="New password"
          description="PasswordNew label"
        />
      </Label>
      <Input
        id="newPassword"
        type="password"
        mb={2}
        sx={inputStyles}
        {...register('newPassword')}
      />
      <Label htmlFor="confirmNewPassword" sx={labelStyles}>
        <FormattedMessage
          id="app.settings.menu.passwordnew2"
          defaultMessage="Reenter new password"
          description="PasswordNew2 label"
        />
      </Label>
      <Input
        id="confirmNewPassword"
        type="password"
        mb={2}
        sx={inputStyles}
        {...register('confirmNewPassword')}
      />

      <Flex mt="auto" flexDirection="column" width="100%" mb="2">
        {log === true && (
          <Flex
            px={3}
            mb={2}
            height="39px"
            backgroundColor="#15de46"
            alignItems="center"
          >
            <Text>
              <FormattedMessage
                id="app.settings.menu.saved"
                defaultMessage="✓ Settings updated"
                description="Settingsupdated label"
              />
            </Text>
          </Flex>
        )}
        <Button variant="contained" sx={{ flex: 1, color: 'white' }}>
          <FormattedMessage
            id="app.settings.menu.save"
            defaultMessage="Save"
            description="Save label"
          />
        </Button>
      </Flex>
    </Flex>
  );
};

export { Settings };
