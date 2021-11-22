import { ValidationError } from 'yup';
import { GraphQLContext } from '..';
import { findUserById, updateLastQuestion } from '../../model';
// import { TABLE_USER } from './../../../config';

type Question = {
  id: string;
  rId: number;
  gId: number;
  question: string;
  image?: string;
  previousTips: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
};

const mockQuestions = [
  {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    gId: 0,
    question: 'Do kolika jazyků už byla přeložena Bible?',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
    previousTips: [198, 350],
    correctAnswer: 2454,
    timeLimit: 20,
    unit: '',
  },
  {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfb',
    gId: 0,
    question: 'Kolik je na světě monarchií?',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/9/99/CrownBohemia3.jpg',
    previousTips: [30, 50],
    correctAnswer: 44,
    timeLimit: 20,
    unit: '',
  },
  {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfc',
    gId: 0,
    question: 'V jakém roce byl vynalezen plyš?',
    image: 'https://m.media-amazon.com/images/I/71+W1KVVt4L._AC_SX425_.jpg',
    previousTips: [1897, 1905],
    correctAnswer: 1590,
    timeLimit: 20,
    unit: '',
  },
  {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfd',
    gId: 0,
    question: 'Kolik členů má Český rybářský svaz?',
    image:
      'https://cdn.pixabay.com/photo/2020/03/15/10/48/fishing-4933219__340.jpg',
    previousTips: [80000, 250000],
    correctAnswer: 250279,
    timeLimit: 20,
    unit: '',
  },
];

function getQuestion(id: string) {
  return (
    mockQuestions.find((q) => q.id === id) || {
      id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
      gId: 0,
      question: 'Do kolika jazyků už byla přeložena Bible?',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
      previousTips: [198, 350],
      correctAnswer: 2454,
      timeLimit: 20,
      unit: '',
    }
  );
}

export async function getNextQuestion(
  parent: any,
  _: {},
  { dynamo, runCache, user }: GraphQLContext
): Promise<Question | null> {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const userRecord = await findUserById(user.id, { dynamo });

  if (userRecord == null) {
    throw new ValidationError('User does not exist.');
  }

  console.log('user', user);
  console.log('userRecord', userRecord);

  const lastQuestion = userRecord.lastQuestion;

  // if this is the last question in whole bundle, ie. user has completed everything
  if (
    lastQuestion &&
    userRecord.bundle.indexOf(lastQuestion) === userRecord.bundle.length - 1
  ) {
    return null;
  }

  // if user has lastQuestion === null, give him the first question, otherwise select next
  const nextQuestionId = lastQuestion
    ? userRecord.bundle[userRecord.bundle.indexOf(lastQuestion) + 1]
    : userRecord.bundle[0];

  const rId = runCache.getRunId(nextQuestionId);
  const nextQuestion = getQuestion(nextQuestionId);

  await updateLastQuestion(user.id, nextQuestionId, { dynamo });

  return {
    ...nextQuestion,
    rId,
  };
}
