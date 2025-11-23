import { input, select } from '@inquirer/prompts';
import { getInitialTips, getRunConfig } from '../src/server/io/utils';

async function generate() {
  const correctAnswer = await input({
    message: 'Provide correct answer (as integer):',
    validate: (value: string) => {
      if (isNaN(parseInt(value))) return 'Correct answer must be an integer';
      return true;
    },
    required: true,
  });

  for (let i = 0; i < 100; i++) {
    const strategy = getRunConfig();

    console.log('___________ 1. KROK __________');
    console.log('++++++++++++++ gen size je ', strategy.tipsPerGeneration);
    console.log('++++++++++++++ pressure je ', strategy.selectionPressure);
    console.log('++++++++++++++ tips to show je ', strategy.numTipsToShow);
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('\n');
    console.log('___________ 2. KROK __________');
    getInitialTips(parseInt(correctAnswer), strategy);
    console.log('\n');
  }

  console.log('\n');
  console.log('\n');

  console.log(
    `✅ Generated initial runs for correct answer "${correctAnswer}". `
  );
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
