import { input, select } from '@inquirer/prompts';
import { generateInitialGeneration } from '../src/server/io/utils';

async function generate() {
  const correctAnswer = await input({
    message: 'Provide correct answer (as integer):',
    validate: (value: string) => {
      if (isNaN(parseInt(value))) return 'Correct answer must be an integer';
      return true;
    },
    required: true,
  });

  const populationSize = await select({
    message: 'Select population size:',
    choices: [
      { name: '8', value: 8 },
      { name: '12', value: 12 },
      { name: '16', value: 16 },
    ],
  }) as number;

  const start = await select({
    message: 'Select relative start:',
    choices: [
      { name: '1/3', value: 1 / 3 },
      { name: '3', value: 3 },
    ],
  }) as number;

  const startSd = await select({
    message: 'Select start standard deviation:',
    choices: [
      { name: '0.05', value: 0.05 },
      { name: '0.1', value: 0.1 },
      { name: '0.2', value: 0.2 },
    ],
  }) as number;

  const sCoeficient = 0.25;

  const initialTips = generateInitialGeneration(
    populationSize,
    sCoeficient,
    start,
    startSd,
    parseInt(correctAnswer)
  );

  console.log(
    `✅ Generated initial tips for correct answer "${correctAnswer}": `,
    initialTips.join(', ')
  );
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
