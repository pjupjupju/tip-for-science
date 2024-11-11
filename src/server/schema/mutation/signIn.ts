import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import { GraphQLContext, UserTokenData } from '../context';
import { findUserByEmail, updateUserSettings } from '../../model';
import { JWT_SECRET } from '../../../config';
import { SignInResultSource } from '../types';
import { countries } from '../../io';

export async function signIn(
  parent: any,
  args: { email: string; password: string },
  context: GraphQLContext
): Promise<SignInResultSource> {
  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      email: yup
        .string()
        .lowercase()
        .email('Prosím, zadej platný e-mail')
        .required('Prosím, zadej e-mail'),
      password: yup.string().required('Prosím, zadej heslo'),
    })
    .required();

  try {
    const { email, password } = await validator.validate(args, {
      abortEarly: false,
    });
    const user = await findUserByEmail(email, context);

    if (user == null || !compareSync(password, user.password)) {
      throw new yup.ValidationError('Nesprávné přihlašovací údaje', null, '');
    }

    let language = user.language;

    if (!user.country) {
      const countryResponse = await fetch(
        `https://api.country.is/86.49.101.82`
      );
      const country = await countryResponse.json();
      language = countries[country?.country || 'GB'].language;

      await updateUserSettings(
        user.id,
        {
          country: country?.country || 'N/A',
          language,
        },
        context
      );
    }

    const token = sign(
      {
        id: user.id,
        language,
      } as UserTokenData,
      JWT_SECRET,
      {
        expiresIn: '90 days',
      }
    );

    // eslint-disable-next-line no-param-reassign
    context.request.session!.token = token;
    // assign user data to context so it can be used in downstream gql operations
    // eslint-disable-next-line no-param-reassign
    context.user = { id: user.id, language };
    context.language = language;

    await new Promise<void>((resolve, reject) => {
      try {
        context.request.session!.save((err) => (err ? reject(err) : resolve()));
      } catch (e) {
        reject(e);
      }
    });

    return {
      type: 'SignInSuccess',
      viewer: {},
    };
  } catch (e) {
    if (yup.ValidationError.isError(e)) {
      return { type: 'ValidationError', error: e };
    }

    throw e;
  }
}
