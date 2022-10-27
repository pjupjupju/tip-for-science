import { ValidationError } from 'yup';
import { getUserProgress } from '../../model';
import { GraphQLContext } from '../context';

export async function getUserStats(
  parent: any,
  _: {},
  { dynamo, user }: GraphQLContext
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
    .sort((a, b) => a.day - b.day)
    .map(({ day, score }, index, arr) => ({
      day,
      score:
        score +
        arr
          .filter((i) => i.day < day)
          .reduce((acc, item) => acc + item.score, 0),
    }));

  if (days.length === 1) {
    const today = new Date().setHours(0, 0, 0, 0);

    if (!days.find((d) => d.day === today)) {
      days.push({ day: today, score: days[days.length - 1].score });
    }
  }

  if (days[days.length - 1].day - days[0].day < 24 * 60 * 60 * 1000 * 5) {
    const firstDay = new Date(days[0].day);
    const daysNeeded = 5 - days.length;

    for (let i = daysNeeded; i > 0; i--) {
      const addingDay = new Date(days[0].day);
      days.unshift({ day: addingDay.setDate(firstDay.getDate() - (daysNeeded - i + 1)), score: 0 });
    }
  }

  return {
    days,
  };
}
