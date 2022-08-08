import { DynamoDB } from 'aws-sdk';
import { compareSync, hashSync } from 'bcryptjs';
import { ValidationError } from 'yup';
import { findUserById, updateUserSettings } from '../../model';
import { User } from '../../model/types';

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
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const { oldPassword, newPassword, ...rest } = changeSet;
  const userRecord = await findUserById(user.id, { dynamo });

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

  await updateUserSettings(user.id, settings, { dynamo });

  return true;
}
