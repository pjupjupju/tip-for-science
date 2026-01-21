import { hashSync } from 'bcryptjs';
import crypto from 'crypto';
import * as yup from 'yup';
import {
  findUserById,
  getPasswordResetRequest,
  resetUserPassword,
} from '../../model';
import { GraphQLContext } from '../context';

function sha256(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function resetPassword(
  _parent,
  args: { id: string; token: string; newPassword: string },
  context: GraphQLContext
) {
  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      id: yup.string().required(),
      token: yup.string().required(),
      newPassword: yup.string().required(),
    })
    .required();

  try {
    const { id, token, newPassword } = await validator.validate(args, {
      abortEarly: false,
    });

    const requestRecord = await getPasswordResetRequest(id, context);

    if (!requestRecord) {
      throw new yup.ValidationError(
        [new yup.ValidationError('Invalid or expired token', args, 'token')],
        args,
        'token'
      );
    }

    if (requestRecord.usedAt || requestRecord.revokedAt) {
      throw new yup.ValidationError(
        [new yup.ValidationError('Invalid or expired token', args, 'token')],
        args,
        'token'
      );
    }
    if (new Date(requestRecord.expiresAt).getTime() < Date.now()) {
      throw new yup.ValidationError(
        [new yup.ValidationError('Invalid or expired token', args, 'token')],
        args,
        'token'
      );
    }

    const tokenHash = sha256(token);

    if (tokenHash !== requestRecord.tokenHash) {
      throw new yup.ValidationError(
        [new yup.ValidationError('Invalid or expired token', args, 'token')],
        args,
        'token'
      );
    }

    const user = await findUserById(requestRecord.userId, context);

    if (!user) {
      throw new yup.ValidationError(
        [new yup.ValidationError('Invalid or expired token', args, 'token')],
        args,
        'token'
      );
    }

    const passwordHash = hashSync(newPassword, 10);

    await resetUserPassword(user.id, id, passwordHash, context);

    return {
      type: 'ResetPasswordSuccess',
      result: true,
    };
  } catch (e) {
    if (yup.ValidationError.isError(e)) {
      return { type: 'ValidationError', error: e };
    }

    throw e;
  }
}
