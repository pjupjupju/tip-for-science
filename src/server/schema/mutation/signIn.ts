import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import { GraphQLContext, UserTokenData } from '../context';
import { findUserByEmail } from '../../model';
import { JWT_SECRET } from '../../../config';
import { SignInResultSource } from '../types';

export async function signIn(
  parent: any,
  args: { email: string; password: string },
  context: GraphQLContext,
): Promise<SignInResultSource> {
  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      email: yup
        .string()
        .lowercase()
        .email()
        .required(),
      password: yup.string().required(),
    })
    .required();

  try {
    const { email, password } = await validator.validate(args, {
      abortEarly: false,
    });
    const user = await findUserByEmail(email, context);

    if (user == null || !compareSync(password, user.password)) {
      throw new yup.ValidationError('Invalid credentials provided', null, '');
    }

    const token = sign(
      {
        id: user.id,
      } as UserTokenData,
      JWT_SECRET,
      {
        expiresIn: '90 days',
      },
    );

    // eslint-disable-next-line no-param-reassign
    context.request.session!.token = token;
    // assign user data to context so it can be used in downstream gql operations
    // eslint-disable-next-line no-param-reassign
    context.user = { id: user.id };

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
