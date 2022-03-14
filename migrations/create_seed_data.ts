import { DynamoDB } from 'aws-sdk';
import { hashSync } from 'bcryptjs';
import { ulid } from 'ulid';
import { TABLE_QUESTION, TABLE_USER } from '../src/config';
import { UserRole } from '../src/server/model/types';

const db = new DynamoDB.DocumentClient(
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        endpoint: 'http://localhost:8000',
        region: 'eu-central-1',
      }
);

async function createSeedData() {
  const id1 = ulid();
  const id2 = ulid();
  const password = ulid();

  const idQ1 = ulid();
  const idQ2 = ulid();

  const idT1 = ulid();
  const idT2 = ulid();
  const idT3 = ulid();
  const idT4 = ulid();

  const paramsForUserBatch = {
    RequestItems: {
      [TABLE_USER]: [
        {
          PutRequest: {
            Item: {
              id: id1,
              batch: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id1}`,
              email: 'testuser1@testuser.com',
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: id1,
              score: 5,
              updatedAt: new Date().toISOString(),
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: id2,
              batch: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id2}`,
              email: 'testuser2@testuser.com',
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: id2,
              score: 10,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      ],
    },
  };

  const paramsForQuestionBatch = {
    RequestItems: {
      [TABLE_QUESTION]: [
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              settings: {
                question: 'Do kolika jazyků už byla přeložena Bible?',
                image:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
                correctAnswer: 2454,
                timeLimit: 20,
                unit: '',
              },
              qsk: `Q#${idQ1}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              settings: {
                question: 'Kolik váží 1200kg slon?',
                image:
                  'https://cs.wikipedia.org/wiki/Slon#/media/Soubor:ElephantTrainingCamp.jpg',
                correctAnswer: 1200,
                timeLimit: 20,
                unit: 'kg',
              },
              qsk: `Q#${idQ2}`,
            },
          },
        },
      ],
    },
  };

  const paramsForRunsBatch = {
    RequestItems: {
      [TABLE_QUESTION]: [
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `R#1`,
              qer_qsi: `Q#${idQ1}#false#R#1`,
              lastTips: [44, 310],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `R#2`,
              qer_qsi: `Q#${idQ1}#true#R#2`,
              lastTips: [10, 377],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              qsk: `R#1`,
              qer_qsi: `Q#${idQ2}#true#R#1`,
              lastTips: [1002, 7800],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT1}`,
              qer_qsi: `Q#${idQ1}#false#R#1`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT2}`,
              qer_qsi: `Q#${idQ1}#false#R#1`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT3}`,
              qer_qsi: `Q#${idQ1}#true#R#2`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              qsk: `T#${idT4}`,
              qer_qsi: `Q#${idQ2}#true#R#1`,
            },
          },
        },
      ],
    },
  };

  await db.batchWrite(paramsForUserBatch).promise();
  console.log(`✅ User data have been created successfully.`);

  await db.batchWrite(paramsForQuestionBatch).promise();
  console.log(`✅ Question data have been created successfully.`);

  await db.batchWrite(paramsForRunsBatch).promise();
  console.log(`✅ Run data have been created successfully.`);
  console.log(`✅ Seed data injection done.`);
}

createSeedData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
