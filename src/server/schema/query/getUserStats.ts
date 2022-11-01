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

  const days = records
    .map((r) => ({
      day: Date.parse(r.createdAt),
      score: parseFloat(r.score.toFixed(1)),
    }))
    .sort((a, b) => a.day - b.day)
    .map((r, index, arr) => ({
      day: r.day,
      score: arr.slice(0, index).reduce((acc, i) => i.score + acc, r.score),
    }));

  const today = new Date().setHours(0, 0, 0, 0);

  if (days.length === 1) {
    if (!days.find((d) => d.day === today)) {
      days.push({ day: today, score: days[days.length - 1].score });
    }
  }

  if (
    days.length > 0 &&
    days[days.length - 1].day - days[0].day < 24 * 60 * 60 * 1000 * 5
  ) {
    const firstDay = new Date(days[0].day);
    const daysNeeded = 7 - days.length;

    for (let i = daysNeeded; i > 0; i--) {
      const addingDay = new Date(days[0].day);
      days.unshift({
        day: addingDay.setDate(firstDay.getDate() - (daysNeeded - i + 1)),
        score: 0,
      });
    }
  }

  const lastDay =
    days.length > 0
      ? new Date(days[days.length - 1].day).setHours(0, 0, 0, 0)
      : null;

  if (lastDay && lastDay !== today) {
    days.push({ day: today, score: days[days.length - 1].score });
  }

  return {
    days,
  };
}
