import { hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import { GraphQLContext, UserTokenData } from '../context';
import { createUser } from '../../model';
import { JWT_SECRET } from '../../../config';
import { SignInResultSource } from '../types';
import { UserRole } from '../../model/types';
import { detectLanguage } from '../../io/detectLanguage';
import { setLanguageCookie } from '../../io/languageCookie';

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

    const { country, language } = await detectLanguage(context.request.ip);

    const newUser = {
      email: email.toLowerCase(),
      password: hashSync(password, 10),
      role: UserRole.player,
      country,
      language,
    };

    const user = await createUser(newUser, context);

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

    await new Promise<void>((resolve, reject) => {
      context.request.session!.save((error) => error ? reject(error) : resolve());
    });

    setLanguageCookie(context.response, language);

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
