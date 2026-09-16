import { google } from 'googleapis';
import {
  ImportedQuestionSettings,
  ImportedTranslationSettings,
} from '../model/types';
import googleCredentials from './google-credentials.json';
import { parseTranslations } from './parseTranslations';

process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-credentials.json';

function getToken() {
  const googleJwt = new google.auth.JWT(
    googleCredentials.client_email,
    undefined,
    googleCredentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  return googleJwt;
}

async function getQuestionBatch(
  spreadsheetId: string,
  sheetName: string
): Promise<ImportedQuestionSettings[]> {
  const googleJwt = getToken();
  const sheets = google.sheets('v4');
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: googleJwt,
      spreadsheetId,
      range: `${sheetName}!A1:L`,
    });

    // Getting rowData - settings and data of all rows/cells
    const {
      data: {
        sheets: [
          {
            data: [{ rowData }],
          },
        ],
      },
    }: any = await sheets.spreadsheets.get({
      auth: googleJwt,
      spreadsheetId,
      ranges: [`${sheetName}!A1:L`],
      includeGridData: true,
    });

    // Slice only rows of questions
    const rows = response!.data!.values!.slice(1);

    if (rows.length === 0) {
      console.log('No data found inside spreadsheet.');
      return [];
    }

    return rows.map((r, index) => ({
      qIdInSheet: r[0],
      question: r[1],
      unit: r[3],
      image: r[4],
      fact: r[5],
      correctAnswer: Number(r[2].replace(',', '.')),
      timeLimit: isNaN(parseInt(r[6])) ? undefined : parseInt(r[6]),
      isInit: r[7].toLowerCase() === 'true',
    }));
  } catch (e) {
    console.error(e);
    new Error(
      'The Spreadsheet API returned an error. Check your arguments and try again.'
    );
  }

  return [];
}

async function getTranslationBatch(
  spreadsheetId: string,
  sheetName: string // = language code
): Promise<ImportedTranslationSettings[]> {
  const googleJwt = getToken();
  const sheets = google.sheets('v4');
  if (!spreadsheetId) throw new Error('The import spreadsheet is not configured.');
  const response = await sheets.spreadsheets.values.get({
    auth: googleJwt,
    spreadsheetId,
    range: `'${sheetName.replace(/'/g, "''")}'!A1:D`,
  });
  return parseTranslations(response.data.values || [], sheetName);
}

export async function getTranslationSheets(spreadsheetId: string): Promise<string[]> {
  if (!spreadsheetId) throw new Error('The import spreadsheet is not configured.');
  const { data } = await google.sheets('v4').spreadsheets.get({
    auth: getToken(),
    spreadsheetId,
    fields: 'sheets.properties.title',
  });
  return (data.sheets || [])
    .map(sheet => sheet.properties.title)
    .filter(title => title && title !== 'import');
}

export { getQuestionBatch, getTranslationBatch };
