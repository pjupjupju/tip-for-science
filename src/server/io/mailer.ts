import SibApiV3Sdk from 'sib-api-v3-sdk';
import { EMAIL_FROM, EMAIL_FROM_NAME, EMAIL_LOGO_URL } from '../../config';

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey =
  process.env.MAILER_API_KEY || process.env.RAZZLE_MAILER_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

const logoUrl = EMAIL_LOGO_URL;

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
    textContent: `Reset hesla - Tip for Science

      Někdo požádal o reset hesla k Vašemu účtu.
      Pokud jste to byli vy, použijte tento odkaz pro nastavení nového hesla:

      ${resetLink}

      Odkaz vyprší za ${minutesValid} minut.

      Pokud jste o reset nežádali, ignorujte tento e-mail. Odkaz automaticky vyprší.

      Podpora: tipforscienceapp@gmail.com
`,
    htmlContent: `
      <!doctype html>
        <html lang="cs">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="x-apple-disable-message-reformatting" />
            <title>Reset hesla</title>
          </head>

          <body style="margin:0; padding:0; background:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111827;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
              Někdo na Vašem účtu požádal o reset hesla. Odkaz je platný ${minutesValid} minut.
            </div>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f7fb; padding:24px 12px;">
              <tr>
                <td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%; max-width:600px;">

                    <!-- Header -->
                    <tr>
                      <td style="padding: 8px 8px 16px 8px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td align="left" style="vertical-align:middle; width:40px; max-width:40px; padding:0; margin:0;">
                              <!-- Logo placeholder -->
                              <div style="display:inline-block; width:40px; height:40px; border-radius:10px; background:#e5e7eb; overflow:hidden;">
                                ${
                                  logoUrl
                                    ? `<img src="${logoUrl}" width="40" height="40" alt="Tip for Science" style="display:block; width:40px; height:40px; object-fit:contain;" />`
                                    : ``
                                }
                              </div>
                            </td>
                            <td style="vertical-align:middle; padding-left:12px;">
                              <div style="
                                font-size:16px;
                                line-height:1.2;
                                font-weight:800;
                                letter-spacing:0.2px;
                                color:#111827;
                              ">
                                Tip for Science
                              </div>
                            </td>

                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                      <td style="background:#ffffff; border-radius:16px; padding:28px 24px; box-shadow: 0 8px 30px rgba(17, 24, 39, 0.08);">
                        
                        <h1 style="margin:0 0 12px 0; font-size:22px; line-height:1.25; color:#111827;">
                          Reset hesla
                        </h1>

                        <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#374151;">
                          Dobrý den,
                        </p>

                        <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#374151;">
                          někdo požádal o <strong>reset hesla</strong> k Vašemu účtu v aplikaci <strong>Tip for Science</strong>.
                        </p>

                        <p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:#374151;">
                          Pokud jste to byli vy, klikněte na tlačítko níže a nastavte si nové heslo.
                        </p>

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 18px 0;">
                          <tr>
                            <td align="left">
                              <a href="${resetLink}"
                                style="
                                  display:inline-block;
                                  background:#111827;
                                  color:#ffffff;
                                  text-decoration:none;
                                  font-size:14px;
                                  font-weight:600;
                                  padding:12px 16px;
                                  border-radius:12px;
                                ">
                                Nastavit nové heslo
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:0 0 14px 0; font-size:13px; line-height:1.6; color:#6b7280;">
                          Tento odkaz je platný <strong>${minutesValid} minut</strong>.
                        </p>

                        <div style="
                          margin: 16px 0 0 0;
                          padding: 14px 14px;
                          background:#f9fafb;
                          border:1px solid #e5e7eb;
                          border-radius:12px;
                        ">
                          <p style="margin:0; font-size:13px; line-height:1.6; color:#374151;">
                            <strong>Nežádali jste o reset hesla?</strong><br />
                            V tom případě tento e-mail ignorujte. Odkaz automaticky vyprší a nebude možné ho použít.
                          </p>
                        </div>

                        <div style="height:1px; background:#e5e7eb; margin:20px 0;"></div>

                        <p style="margin:0 0 10px 0; font-size:13px; line-height:1.6; color:#6b7280;">
                          Pokud máte jakékoli otázky nebo technické potíže, napište nám na:
                          <a href="mailto:tipforscienceapp@gmail.com" style="color:#111827; text-decoration:underline;">
                            tipforscienceapp@gmail.com
                          </a>
                        </p>

                        <p style="margin:0; font-size:12px; line-height:1.6; color:#9ca3af;">
                          Bezpečnostní tip: nikdy nesdílejte svůj resetovací odkaz ani heslo s nikým dalším.
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:16px 6px 0 6px; text-align:center;">
                        <p style="margin:0; font-size:12px; line-height:1.6; color:#9ca3af;">
                          Tento e-mail byl odeslán automaticky. Pokud jste o reset nežádali, můžete ho bezpečně ignorovat.
                        </p>
                        <p style="margin:8px 0 0 0; font-size:12px; line-height:1.6; color:#9ca3af;">
                          © ${new Date().getFullYear()} Tip for Science
                        </p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>
          </body>
        </html>`,
  });
}
