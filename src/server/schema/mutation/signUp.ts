import { hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import { GraphQLContext, UserTokenData } from '../context';
import { createUser } from '../../model';
import { JWT_SECRET } from '../../../config';
import { SignInResultSource } from '../types';
import { UserRole } from '../../model/types';
import { countries } from '../../io';

export async function signUp(
  parent: any,
  args: { email: string; password: string },
  context: GraphQLContext
): Promise<SignInResultSource> {
  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      email: yup.string().lowercase().email().required(),
      password: yup.string().required(),
    })
    .required();

  try {
    const { email, password } = await validator.validate(args, {
      abortEarly: false,
    });

    const countryResponse = await fetch(
      `https://api.country.is/86.49.101.82`
    );
    const country = await countryResponse.json();

    const newUser = {
      email: email.toLowerCase(),
      password: hashSync(password, 10),
      role: UserRole.player,
      country: country?.country || 'N/A',
      language: countries[country?.country || 'GB'].language,
    };

    const user = await createUser(newUser, context);

    const token = sign(
      {
        id: user.id,
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
    context.user = { id: user.id };

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
