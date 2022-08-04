import { DynamoDB } from 'aws-sdk';
import { createUser, UserRole } from '../model';

export async function createAdmin(dynamo: DynamoDB.DocumentClient) {
  await createUser(
    {
      email: process.env.AUSER.toLowerCase(),
      password: process.env.APASS,
      role: UserRole.admin,
    },
    { dynamo }
  );
}
