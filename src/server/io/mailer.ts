import SibApiV3Sdk from 'sib-api-v3-sdk';
import { EMAIL_FROM, EMAIL_FROM_NAME } from '../../config';

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey =
  process.env.MAILER_API_KEY || process.env.RAZZLE_MAILER_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendPasswordResetEmail(params: {
  to: string;
  resetLink: string;
  minutesValid: number;
}) {
  const fromEmail = EMAIL_FROM;
  const fromName = EMAIL_FROM_NAME;
  const { to, resetLink, minutesValid } = params;

  await api.sendTransacEmail({
    sender: { email: fromEmail, name: fromName },
    to: [{ email: to }],
    subject: 'Reset hesla',
    textContent: `Reset hesla: ${resetLink}\nLink vyprší za ${minutesValid} minut.`,
    htmlContent: `
      <p>Klikni pro reset hesla:</p>
      <p><a href="${resetLink}">Reset hesla</a></p>
      <p>Link vyprší za ${minutesValid} minut.</p>
    `,
  });
}
