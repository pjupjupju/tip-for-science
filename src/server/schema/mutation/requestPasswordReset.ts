import crypto from 'crypto';
import * as yup from 'yup';
import { sendPasswordResetEmail } from '../../io/mailer';
import {
  createPasswordResetRequest,
  findUserByEmail,
  invalidatePasswordResetRequests,
  isOverLimitPasswordResets,
} from '../../model';
import { PRODUCTION_APP_ORIGIN } from '../../../config';
import { GraphQLContext } from '../context';

const env = process.env.NODE_ENV;
const appOrigin =
  env === 'production' ? PRODUCTION_APP_ORIGIN : process.env.APP_ORIGIN;

const RESET_TTL_MINUTES = 120;

function sha256(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function requestPasswordReset(
  _parent,
  args: { email: string },
  context: GraphQLContext
) {
  const validator = yup
    .object()
    .noUnknown(true)
    .shape({
      email: yup.string().lowercase().email().required(),
    })
    .required();

  let email: string;

  try {
    ({ email } = await validator.validate(args, {
      abortEarly: false,
    }));
  } catch (e) {
    if (yup.ValidationError.isError(e)) {
      return { type: 'ValidationError', error: e };
    }

    throw e;
  }

  const normalized = email.trim().toLowerCase();
  const user = await findUserByEmail(normalized, context);

  // Return true if user does not exist, so attacker cannot check for accounts
  if (!user) {
    return {
      type: 'RequestPasswordResetSuccess',
      result: true,
    };
  }

  const isOverLimit = await isOverLimitPasswordResets(user.id, context);
  if (isOverLimit) {
    throw new Error('Limit for password resets hit for 24 hours.');
  }

  // Invalidate old requests
  await invalidatePasswordResetRequests(user.id, context);

  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60000);

  const params = {
    id,
    userId: user.id,
    tokenHash,
    expiresAt,
    ip: context.request.ip,
    userAgent: context.request.headers?.['user-agent'],
  };

  await createPasswordResetRequest(params, context);

  const resetLink = `${appOrigin}/reset-password?id=${id}&token=${token}`;

  await sendPasswordResetEmail({
    to: user.email,
    resetLink,
    minutesValid: RESET_TTL_MINUTES,
  });

  return {
    type: 'RequestPasswordResetSuccess',
    result: true,
  };
}
