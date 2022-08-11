import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Label, Radio } from '@rebass/forms';
import { Flex, Button, Text, Box } from 'rebass';
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

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .notRequired()
    .matches(emailRegex, 'Prosím, zadej platný e-mail')
    .nullable()
    .transform((value) => (!!value ? value : undefined)),
  oldPassword: Yup.mixed()
    .when('newPassword', {
      is: (val) => val !== '' && val != null,
      then: Yup.string().required(
        'Pro změnu hesla musíš vyplnit aktuální heslo'
      ),
      otherwise: Yup.mixed().notRequired(),
    })
    .strict(),
  confirmNewPassword: Yup.mixed()
    .when('newPassword', {
      is: (val) => val !== '' && val != null,
      then: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Hesla se neshodují')
        .required(),
      otherwise: Yup.mixed().notRequired(),
    })
    .strict(),
  newPassword: Yup.string()
    .notRequired()
    .min(
      MIN_PASSWORD_LENGTH,
      `Heslo musí mít alespoň ${MIN_PASSWORD_LENGTH} znaků`
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

const Settings = ({ user }: { user: User | null }) => {
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
        Všechny údaje budou před vyhodnocením anonymizovány.
      </Text>

      <Text color="secondary" fontSize={3} mt={2} mb={3} px={3}>
        Nastavení účtu
      </Text>
      <Label htmlFor="email" sx={labelStyles}>
        E-mail
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
        Aktuální heslo
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
        Nové heslo
      </Label>
      <Input
        id="newPassword"
        type="password"
        mb={2}
        sx={inputStyles}
        {...register('newPassword')}
      />
      <Label htmlFor="confirmNewPassword" sx={labelStyles}>
        Nové heslo znovu
      </Label>
      <Input
        id="confirmNewPassword"
        type="password"
        mb={2}
        sx={inputStyles}
        {...register('confirmNewPassword')}
      />

      <Text color="secondary" fontSize={3} mt={4} px={3}>
        Nepovinné údaje
      </Text>

      <Box my={3}>
        <Label htmlFor="gender" sx={radioLabelStyles}>
          Jsem
        </Label>
        <Label color="white">
          <Radio
            {...register('gender')}
            name="gender"
            id="woman"
            value="woman"
          />
          Žena
        </Label>
        <Label color="white">
          <Radio {...register('gender')} name="gender" id="man" value="man" />
          Muž
        </Label>
        <Label color="white">
          <Radio {...register('gender')} name="gender" id="enby" value="enby" />
          Nebinární
        </Label>
        <Label color="white">
          <Radio
            {...register('gender')}
            name="gender"
            id="other"
            value="other"
          />
          Jiné (můžeš uvést):
        </Label>
        {watchGender === 'other' && (
          <Input
            ref={otherGenderInputRef}
            placeholder="uveď, prosím"
            mb="2"
            defaultValue={user.gender}
            sx={otherGenderInputStyles}
          />
        )}
      </Box>
      <Label htmlFor="email" sx={labelStyles}>
        Věk
      </Label>
      <Input
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

      <Flex mt="auto" flexDirection="column" width="100%" mb="2">
        {log === true && (
          <Flex
            px={3}
            mb={2}
            height="39px"
            backgroundColor="#15de46"
            alignItems="center"
          >
            <Text>✓ Nastavení uloženo</Text>
          </Flex>
        )}
        <Button sx={{ flex: 1, color: 'white' }}>Uložit</Button>
      </Flex>
    </Flex>
  );
};

export { Settings };
