import { input } from '@inquirer/prompts';
import { getInitialTips, getRunConfig } from '../src/server/io/utils';
import { selectPreviousTipsToDisplay } from '../src/helpers/selectPreviousTipsToDisplay';

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
    const strategy = getRunConfig(i + 1);

    console.log(`🧚🏻‍♀️ run # ${i + 1} 🧚🏻‍♀️`);
    console.log('___________ 1. STEP __________');
    console.log('-------------- gen size: ', strategy.tipsPerGeneration);
    console.log('-------------- pressure: ', strategy.selectionPressure);
    console.log('-------------- tips to show: ', strategy.numTipsToShow);
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('\n');
    console.log('___________ 2. STEP __________');

    const initialTips = getInitialTips(parseInt(correctAnswer), strategy);
    let parents = selectPreviousTipsToDisplay(initialTips, strategy);

    console.log('-------------- shown parents: ', parents.join(', '));

    //gives correct number of combination of parents
    for (let i = 1; i < strategy.tipsPerGeneration; i++) {
      parents = selectPreviousTipsToDisplay(initialTips, strategy);
      console.log('-------------- shown parents: ', parents.join(', '));
    }
    console.log('\n');
  }
  console.log('\n');
  console.log('\n');
  console.log(
    `✅ Generated initial runs for correct answer "${correctAnswer}".`
  );
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
