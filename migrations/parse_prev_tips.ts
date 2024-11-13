import fs from 'fs';
import { parse } from 'csv-parse';
import { writeToPath } from '@fast-csv/format';

type ImportedStrategy = {
  id: number;
  selection_pressures_for_runs: number[];
  generation_sizes_for_runs: number[];
  initial_tip_sets_for_runs: number[][];
  num_tips_to_show: number[];
};

async function parsePrevTips() {
  const splitPath = __dirname.split('/');
  const dir = `./${splitPath[splitPath.length - 1]}`;

  const [inputFile] = process.argv.slice(2);
  const [outputFile] = process.argv.slice(3);

  if (inputFile == null) {
    throw new Error('No input file name specified');
  }

  const inputFileName = `${dir}/${inputFile}`;
  const outputFileName = `${dir}/${
    outputFile ||
    `${inputFile.split('.')[0]}_${Date.now().toString()}_parsed.txt`
  }`;

  const parser = fs.createReadStream(inputFileName).pipe(
    parse({
      delimiter: [' ', '	'],
      trim: true,
      columns: true,
    })
  );

  const questionMap = new Map<string, ImportedStrategy>();

  for await (const record of parser) {
    const id = record.qID;
    const initialTips = [record.p1, record.p2, record.p3, record.p4, record.p5]
      .filter(
        (t: string) =>
          !['NA', 'N/A', 'NaN', '', ' ', null].includes(t) &&
          typeof t !== 'undefined'
      )
      .map((t) => parseInt(t));

    // collect a map of questions with their settings collapsed into arrays (from individual rows)
    const q = questionMap.get(id);

    if (typeof q === 'undefined') {
      questionMap.set(id, {
        id: parseInt(id),
        selection_pressures_for_runs: [parseFloat(record.s)],
        generation_sizes_for_runs: [parseInt(record.N)],
        initial_tip_sets_for_runs: [initialTips],
        num_tips_to_show: [parseInt(record['M.show'])],
      });
    } else {
      questionMap.set(id, {
        id: parseInt(id),
        selection_pressures_for_runs: [
          ...q.selection_pressures_for_runs,
          parseFloat(record.s),
        ],
        generation_sizes_for_runs: [
          ...q.generation_sizes_for_runs,
          parseInt(record.N),
        ],
        initial_tip_sets_for_runs: [
          ...q.initial_tip_sets_for_runs,
          initialTips,
        ],
        num_tips_to_show: [...q.num_tips_to_show, parseInt(record['M.show'])],
      });
    }
  }

  console.log('done parsing');

  //const writableStream = fs.createWriteStream(outputFileName);

  const headers = [
    'id',
    'selection_pressures_for_runs',
    'generation_sizes_for_runs',
    'initial_tip_sets_for_runs',
    'num_tips_to_show',
  ];
  const rows: {
    id: string;
    selection_pressures_for_runs: string;
    generation_sizes_for_runs: string;
    initial_tip_sets_for_runs: string;
    num_tips_to_show: string;
  }[] = [];

  // rows.push(headers);

  questionMap.forEach((q) => {
    const {
      id,
      selection_pressures_for_runs,
      generation_sizes_for_runs,
      initial_tip_sets_for_runs,
      num_tips_to_show,
    } = q;

    rows.push({
      id: id.toString(),
      selection_pressures_for_runs: JSON.stringify(
        selection_pressures_for_runs
      ),
      generation_sizes_for_runs: JSON.stringify(generation_sizes_for_runs),
      initial_tip_sets_for_runs: JSON.stringify(initial_tip_sets_for_runs),
      num_tips_to_show: JSON.stringify(num_tips_to_show),
    });
  });

  console.log(JSON.stringify(rows));

  // @ts-ignore
  writeToPath(outputFileName, rows);
}

parsePrevTips()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
