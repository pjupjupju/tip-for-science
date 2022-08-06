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
  sheetName: string,
  strategySheetName: string
): Promise<ImportedQuestionSettings[]> {
  const googleJwt = getToken();
  const sheets = google.sheets('v4');
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: googleJwt,
      spreadsheetId,
      range: `${sheetName}!A1:L`,
    });

    const strategyResponse = await sheets.spreadsheets.values.get({
      auth: googleJwt,
      spreadsheetId,
      range: `${strategySheetName}!A1:F`,
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
    const strategyRows = strategyResponse!
      .data!.values!.slice(1)
      .filter((r) => typeof r[0] !== 'undefined');

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
      selectionPressure: JSON.parse(strategyRows[index][1]),
      tipsPerGeneration: JSON.parse(strategyRows[index][2]),
      initialTips: JSON.parse(strategyRows[index][3]),
      numTipsToShow: JSON.parse(strategyRows[index][4]),
    }));

    // TODO: filter to include only rows with white background or other way to select what is not imported yet
    // TODO: change background color or setting in spreadsheet to mark what has been already imported - maybe do it after database insert instead?

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
