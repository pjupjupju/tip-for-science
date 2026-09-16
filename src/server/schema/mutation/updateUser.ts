import { compareSync, hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import { findAllLanguages, findUserById, updateUserSettings } from '../../model';
import { JWT_SECRET } from '../../../config';
import { GraphQLContext, UserTokenData } from '../context';
import { setLanguageCookie } from '../../io/languageCookie';

type ChangeSet = {
  email?: string;
  password?: string;
  age?: number;
  gender?: string;
  language?: string;
};

export async function updateUser(
  parent: any,
  changeSet: {
    email?: string;
    newPassword?: string;
    oldPassword?: string;
    age?: number;
    gender?: string;
    language?: string;
  },
  context: GraphQLContext
) {
  const { user } = context;

  if (user == null) {
    throw new yup.ValidationError('Unauthorized.');
  }

  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      email: yup.string().optional(),
      newPassword: yup.string().optional(),
      oldPassword: yup.string().optional(),
      age: yup.number().optional(),
      gender: yup.string().optional(),
      language: yup.string().optional(),
    })
    .required();

  const validatedChangeSet = await validator.validate(changeSet, {
    abortEarly: false,
  });

  const { oldPassword, newPassword, ...rest } = validatedChangeSet;
  const userRecord = await findUserById(user.id, context);
  if (!userRecord) throw new yup.ValidationError('User does not exist.');

  if (
    newPassword != null &&
    (oldPassword == null || !compareSync(oldPassword, userRecord.password))
  ) {
    throw new yup.ValidationError('Nesprávné uživatelské heslo');
  }

  let settings: ChangeSet = rest;

  if (settings.language != null) {
    const languages = await findAllLanguages(context);
    if (!languages.some(({ lang }) => lang === settings.language)) {
      throw new yup.ValidationError('Unsupported language.');
    }
  }

  if (newPassword) {
    settings = { ...settings, password: hashSync(newPassword, 10) };
  }

  await updateUserSettings(user.id, settings, context);

  if (settings.language) {
    const token = sign(
      {
        id: user.id,
        language: settings.language,
      } as UserTokenData,
      JWT_SECRET,
      {
        expiresIn: '90 days',
      }
    );

    // eslint-disable-next-line no-param-reassign
    context.request.session!.token = token;
    // eslint-disable-next-line no-param-reassign
    context.user = { id: user.id, language: settings.language };
    context.language = settings.language;

    await new Promise<void>((resolve, reject) => {
      try {
        context.request.session!.save((err) => (err ? reject(err) : resolve()));
      } catch (error) {
        reject(error);
      }
    });
    setLanguageCookie(context.response, settings.language);
  }

  return true;
}
