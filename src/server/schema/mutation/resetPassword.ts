import { hashSync } from 'bcryptjs';
import crypto from 'crypto';
import * as yup from 'yup';
import { getPasswordResetRequest, resetUserPassword } from '../../model';
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

    const { user } = context;
    const requestRecord = await getPasswordResetRequest(id, context);

    if (!requestRecord) {
      throw new Error('Invalid or expired token');
    }

    if (requestRecord.usedAt || requestRecord.revokedAt) {
      throw new Error('Invalid or expired token');
    }
    if (new Date(requestRecord.expiresAt).getTime() < Date.now()) {
      throw new Error('Invalid or expired token');
    }

    const tokenHash = sha256(token);

    if (tokenHash !== requestRecord.tokenHash) {
      throw new Error('Invalid or expired token');
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
