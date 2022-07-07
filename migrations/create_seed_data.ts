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
  const id3 = ulid();
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
        {
          PutRequest: {
            Item: {
              id: id3,
              batch: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id3}`,
              email: 'testuser3@testuser.com',
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: id3,
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
              strategy: {
                initialTips: [],
                selectionPressure: [],

              },
              qsk: `QDATA#${idQ1}`,
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
              qsk: `QDATA#${idQ2}`,
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
              qsk: `Q#${idQ1}#false#R#1`,
              gsi_pk: `Q#${idQ1}#false#R#1`,
              gsi_sk: `Q#${idQ1}#R#1`,
              run: 1,
              generation: 1,
              settings: {
                question: 'Do kolika jazyků už byla přeložena Bible?',
                image:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
                correctAnswer: 2454,
                timeLimit: 20,
                unit: '',
              },
              previousTips: [44, 310],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `Q#${idQ1}#true#R#2`,
              gsi_pk: `Q#${idQ1}#true#R#2`,
              gsi_sk: `Q#${idQ1}#R#2`,
              run: 2,
              generation: 1,
              settings: {
                question: 'Do kolika jazyků už byla přeložena Bible?',
                image:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
                correctAnswer: 2454,
                timeLimit: 20,
                unit: '',
              },
              previousTips: [10, 377],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              qsk: `Q#${idQ2}#true#R#1`,
              gsi_pk: `Q#${idQ2}#true#R#1`,
              gsi_sk: `Q#${idQ2}#R#1`,
              generation: 1,
              run: 1,
              settings: {
                question: 'Do kolika jazyků už byla přeložena Bible?',
                image:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
                correctAnswer: 2454,
                timeLimit: 20,
                unit: '',
              },
              previousTips: [1002, 7800],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT1}`,
              gsi_pk: `Q#${idQ1}#R#1#G#1`,
              gsi_sk: `T#${idT1}`,
              run: 1,
              generation: 1,
              data: {
                tip: 150,
                previousTips: [44,310],
                time: 3000,
                createdBy: id1,
              }
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT2}`,
              gsi_pk: `Q#${idQ1}#R#1#G#1`,
              gsi_sk: `T#${idT2}`,
              run: 1,
              generation: 1,
              data: {
                tip: 2450,
                previousTips: [44,310],
                time: 2000,
                createdBy: id2,
                knewAnwer: false,
              }
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              qsk: `T#${idT3}`,
              gsi_pk: `Q#${idQ1}#R#2#G#1`,
              gsi_sk: `T#${idT3}`,
              run: 2, 
              generation: 1,
              data: {
                tip: 278,
                previousTips: [10,377],
                time: 3000,
                createdBy: id3,
                knewAnwer: false,
              }
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              qsk: `T#${idT4}`,
              gsi_pk: `Q#${idQ2}#R#1#G#1`,
              gsi_sk: `T#${idT4}`,
              run: 1,
              generation: 1,
              data: {
                tip: 3100,
                previousTips: [1002, 7800],
                msElapsed: 4500,
                createdBy: id1,
                knewAnwer: false,
              }
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
