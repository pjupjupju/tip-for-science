import { DynamoDB } from 'aws-sdk';
// import { ulid } from 'ulid';
import { getScore } from '../../../helpers';
import { updateScore } from '../../model';
import { User } from '../../model/types';
// import { TABLE_QUESTION, TABLE_USER } from './../../../config';

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

export async function saveTip(
  parent: any,
  { id, tip }: { id: string; tip: number },
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  console.log(`--- updating Question ${id} with tip ${tip}`);

  const { correctAnswer } = getQuestion(id);
  const questionScore = getScore(tip, correctAnswer);

  await updateScore(user.id, questionScore, { dynamo });

  // TODO: disable Run or Generation if conditions are met (maybe for generation do nothing?)

  // startNewRun() => disable this run and create new one with initial data and disable it in RunCache?

  // saveNewGenLT()

  console.log('here we disable run or generation, if conditions were met');
  //

  /**

  const question = await dynamo.put({
    TableName: TABLE_QUESTION,
    Item: {
      id,
      questionskey: `RUN#${1}`,
      lastTips: [tip],
    },
  }).promise();

  const params = {
    TableName: TABLE_USER,
    Key: { id: user.id, userskey: `USER#${user.id}` },
    UpdateExpression: 'lastQuestion = :lastQuestion',
    ExpressionAttributeValues: {
      ':lastQuestion': id,
    },
  };

  await dynamo.update(params).promise();

  console.log(question);
   * 
   */

  /*

  await dynamo.put({
    TableName: TABLE_USER,
    Item: {
      id: "01FGFWT7TPF5G3CEEGQHH7BAGX",
      question_id: id,
      userskey: `TIP#${tipId}`,
      tip,
      created_at: new Date(),
    },
  });
  */

  // TODO: get next question id somehow
  const nextQuestionId = 'flop';

  return 'ok';

  /*
  return {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: 'How much is the fleeb?',
    image:
      'https://cdn.pixabay.com/photo/2013/07/28/12/23/paperclip-168336_1280.jpg',
    previousTips: [],
    correctAnswer: 15,
    unit: 'kg',
  }; */
}
