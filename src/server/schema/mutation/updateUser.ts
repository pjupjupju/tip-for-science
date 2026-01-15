import { compareSync, hashSync } from 'bcryptjs';
import { ValidationError } from 'yup';
import { findUserById, updateUserSettings } from '../../model';
import { GraphQLContext } from '../context';

type ChangeSet = {
  email?: string;
  password?: string;
  age?: number;
  gender?: string;
};

export async function updateUser(
  parent: any,
  changeSet: {
    email?: string;
    newPassword?: string;
    oldPassword?: string;
    age?: number;
    gender?: string;
  },
  context: GraphQLContext
) {
  const { dynamo, user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const { oldPassword, newPassword, ...rest } = changeSet;
  const userRecord = await findUserById(user.id, context);

  if (
    newPassword != null &&
    (oldPassword == null || !compareSync(oldPassword, userRecord.password))
  ) {
    throw new ValidationError('Nesprávné uživatelské heslo');
  }

  let settings: ChangeSet = rest;

  if (newPassword) {
    settings = { ...settings, password: hashSync(newPassword, 10) };
  }

  await updateUserSettings(user.id, settings, context);

  return true;
}
