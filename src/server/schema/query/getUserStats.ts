import { ValidationError } from 'yup';
import { createUser, getUserProgress, UserRole } from '../../model';
import { GraphQLContext } from '../context';
import { saveTip } from '../mutation';
import { getNextQuestion } from './getNextQuestion';

export async function getUserStats(
  parent: any,
  _: {},
  { dynamo, runCache, user, request }: GraphQLContext
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const records = await getUserProgress(user.id, dynamo);

  const days = Object.entries(
    records.reduce((acc, r) => {
      const parsedDay = new Date(Date.parse(r.createdAt)).setHours(0, 0, 0, 0);
      return {
        ...acc,
        [parsedDay]:
          typeof acc[parsedDay] !== 'undefined'
            ? acc[parsedDay] + r.score
            : r.score,
      };
    }, {})
  )
    .map((e: [string, number]) => ({
      day: Number(e[0]),
      score: parseFloat(e[1].toFixed(1)),
    }))
    .sort((a, b) => a.day - b.day);

  if (days.length === 1) {
    const today = new Date().setHours(0, 0, 0, 0);

    if (!days.find((d) => d.day === today)) {
      days.push({ day: today, score: days[days.length - 1].score });
    }
  }

  if (days.length > 0 && days[0].score !== 0) {
    const firstDay = new Date(days[0].day);
    days.unshift({ day: firstDay.setDate(firstDay.getDate() - 1), score: 0 });
  }

  // stress test

  console.log('START STRESS TEST');

  const userPromises = new Array(27).fill(null).map((_, index) =>
    createUser(
      {
        email: `stresstest_${Date.now()}_${index + 1}@gmail.com`,
        password: 'tipforscience123456',
        role: UserRole.player,
      },
      { dynamo }
    )
  );

  const users = await Promise.all(userPromises);

  const firstRound = users.map(async (u) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 9))
    );
    return getNextQuestion(parent, _, { dynamo, runCache, user: u, request });
  });

  const questionsFirstRound = await Promise.all(firstRound);

  const saveFirstRound = users.map(async (u, i) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 5))
    );
    saveTip(
      parent,
      {
        id: questionsFirstRound[i].id,
        tip: Math.round(questionsFirstRound[i].correctAnswer * Math.random()),
        rId: questionsFirstRound[i].rId,
        gId: questionsFirstRound[i].gId,
        previousTips: questionsFirstRound[i].previousTips,
        knewAnswer: false,
        answered: i % 13 === 0 ? false : true,
        msElapsed: 5000,
      },
      { dynamo, user: users[i] as any }
    );
  });

  await Promise.all(saveFirstRound);


  console.log('first round done');

  const secondRound = users.map(async (u) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 9))
    );
    return getNextQuestion(parent, _, { dynamo, runCache, user, request });
  });

  const questionsSecondRound = await Promise.all(secondRound);

  /*
  const saveSecondRound = users.map(async (u, i) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 6))
    );
    saveTip(
      parent,
      {
        id: questionsSecondRound[i].id,
        tip: questionsSecondRound[i].correctAnswer * Math.random(),
        rId: questionsSecondRound[i].rId,
        gId: questionsSecondRound[i].gId,
        previousTips: questionsSecondRound[i].previousTips,
        knewAnswer: false,
        answered: i % 9 === 0 ? false : true,
        msElapsed: 5000,
      },
      { dynamo, user: user as any }
    );
  });

  await Promise.all(saveSecondRound);

  */

  console.log('second round done');

  const thirdRound = users.map(async (u) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 9))
    );
    return getNextQuestion(parent, _, { dynamo, runCache, user, request });
  });

  const questionsThirdRound = await Promise.all(thirdRound);

  /*
  const saveThirdRound = users.map(async (u, i) => {
    await new Promise((r) =>
      setTimeout(r, 1000 * Math.floor(Math.random() * 4))
    );
    saveTip(
      parent,
      {
        id: questionsThirdRound[i].id,
        tip: questionsThirdRound[i].correctAnswer * Math.random(),
        rId: questionsThirdRound[i].rId,
        gId: questionsThirdRound[i].gId,
        previousTips: questionsThirdRound[i].previousTips,
        knewAnswer: false,
        answered: i % 20 === 0 ? false : true,
        msElapsed: 5000,
      },
      { dynamo, user: user as any }
    );
  });

  await Promise.all(saveThirdRound);

  */
  console.log('third round done');

  console.log('END OF STRESS TEST');

  // end of stress test

  return {
    days,
  };
}
