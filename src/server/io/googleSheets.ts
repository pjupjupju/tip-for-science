import { google } from 'googleapis';
import { ImportedQuestionSettings } from '../model/types';

import googleCredentials from './google-credentials.json';

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

    // Slice only rows of finds
    const rows = response!.data!.values!.slice(1);
    if (rows.length === 0) {
      console.log('No data found inside spreadsheet.');
      return [];
    }

    return rows.map((r) => ({
      question: r[1],
      correctAnswer: r[2],
      unit: r[3],
      image: r[4],
      timeLimit: parseInt(r[6]),
      isInit: r[7].toLowerCase() === 'true',
    }));

    /*
    return rows
      .filter(
        (row, index) =>
          !(
            row.length < 6 ||
            row[6].split(',').length < 2 ||
            isRowWhite(
              rowData[index + 3].values[0].userEnteredFormat.backgroundColor
            )
          )
      )
      .map((row) => ({
        number: row[0],
        id: row[1],
        district,
        lat: row[6].split(',')[0].trim(),
        lon: row[6].split(',')[1].trim(),
        foundAt: row[7],
        author: row[11],
        institution,
      }));
      */
  } catch (e) {
    console.error(e);
    new Error(
      'The Spreadsheet API returned an error. Check your arguments and try again.'
    );
  }

  return [];
}

function isRowWhite(
  backgroundColorObject:
    | { red: number; green: number; blue: number }
    | undefined
) {
  return (
    !backgroundColorObject ||
    backgroundColorObject.red +
      backgroundColorObject.green +
      backgroundColorObject.blue ===
      3
  );
}

export { getQuestionBatch };
