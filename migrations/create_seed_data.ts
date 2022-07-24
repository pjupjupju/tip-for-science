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
  const idQ3 = ulid();

  const idT1 = ulid();
  const idT2 = ulid();
  const idT3 = ulid();
  const idT4 = ulid();
  const idT5 = ulid();

  const paramsForUserBatch = {
    RequestItems: {
      [TABLE_USER]: [
        {
          PutRequest: {
            Item: {
              id: id1,
              bundle: [idQ1, idQ2],
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
              bundle: [idQ1, idQ2],
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
              bundle: [idQ1, idQ2],
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

  // Stress test
  const paramsForUserBatch1 = {
    RequestItems: {
      [TABLE_USER]: Array(24)
        .fill(null)
        .map((_, index) => ({
          PutRequest: {
            Item: {
              id: `${id1}${index}`,
              bundle: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id1}${index}`,
              email: `generatedtestuser${index}@testuser.com`,
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: `${id1}${index}`,
              score: 10 + index,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    },
  };

  const paramsForUserBatch2 = {
    RequestItems: {
      [TABLE_USER]: Array(24)
        .fill(null)
        .map((_, index) => ({
          PutRequest: {
            Item: {
              id: `${id2}${index}`,
              bundle: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id2}${index}`,
              email: `generatedtestuser${index}@testuser.com`,
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: `${id2}${index}`,
              score: 10 + index,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    },
  };

  const paramsForUserBatch3 = {
    RequestItems: {
      [TABLE_USER]: Array(24)
        .fill(null)
        .map((_, index) => ({
          PutRequest: {
            Item: {
              id: `${id3}${index}`,
              bundle: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id3}${index}`,
              email: `generatedtestuser${index}@testuser.com`,
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: `${id3}${index}`,
              score: 10 + index,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    },
  };

  const paramsForUserBatch4 = {
    RequestItems: {
      [TABLE_USER]: Array(24)
        .fill(null)
        .map((_, index) => ({
          PutRequest: {
            Item: {
              id: `${id3}${index}${index}`,
              bundle: [idQ1, idQ2],
              createdAt: new Date().toISOString(),
              userskey: `USER#${id3}${index}${index}`,
              email: `generatedtestuser${index}${index}@testuser.com`,
              password: hashSync(password, 10),
              role: UserRole.player,
              slug: `${id3}${index}${index}`,
              score: 10 + index,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    },
  };

  const paramsForQuestionBatch = {
    RequestItems: {
      [TABLE_QUESTION]: [
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ1}`,
              run: 2,
              settings: {
                question: 'Do kolika jazyků už byla přeložena Bible?',
                image:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
                correctAnswer: 2454,
                timeLimit: 20,
                unit: '',
              },
              strategy: {
                initialTips: [
                  [155, 410, 2900, 4555],
                  [160, 175, 2500, 3100],
                  [220, 244, 2340, 2430],
                ],
                selectionPressure: [0.2, 0.2, 0.4],
                tipsPerGeneration: [5, 5, 5],
              },
              isInit: true,
              qsk: `QDATA#${idQ1}`,
              gsi_pk: `Q`,
              gsi_sk: `QDATA#${idQ1}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ2}`,
              run: 1,
              settings: {
                question: 'Kolik vážil nejtěžší známý slon?',
                image:
                  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
                correctAnswer: 10400,
                timeLimit: 20,
                unit: 'kg',
              },
              strategy: {
                initialTips: [
                  [155, 410, 2900, 4555],
                  [160, 175, 2500, 3100],
                  [220, 244, 2340, 2430],
                ],
                selectionPressure: [0.2, 0.2, 0.4],
                tipsPerGeneration: [5, 5, 5],
              },
              isInit: false,
              qsk: `QDATA#${idQ2}`,
              gsi_pk: `Q`,
              gsi_sk: `QDATA#${idQ2}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ3}`,
              run: 1,
              settings: {
                question: 'Jak vysoká je Šikmá věž v Pise?',
                image:
                  'https://images.unsplash.com/photo-1551981996-1e0aa26c5fba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2440&q=80',
                correctAnswer: 57,
                timeLimit: 20,
                unit: 'm',
              },
              strategy: {
                initialTips: [
                  [19, 89, 180],
                  [29, 69, 181],
                  [80, 90, 100],
                ],
                selectionPressure: [0.2, 0.2, 0.4],
                tipsPerGeneration: [5, 5, 5],
              },
              isInit: false,
              qsk: `QDATA#${idQ3}`,
              gsi_pk: `Q`,
              gsi_sk: `QDATA#${idQ3}`,
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
              strategy: {
                selectionPressure: 0.2,
                tipsPerGeneration: 5,
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
              strategy: {
                selectionPressure: 0.2,
                tipsPerGeneration: 5,
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
                question: 'Kolik vážil nejtěžší známý slon?',
                image:
                  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
                correctAnswer: 10400,
                timeLimit: 20,
                unit: 'kg',
              },
              strategy: {
                selectionPressure: 0.2,
                tipsPerGeneration: 5,
              },
              previousTips: [1002, 7800],
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ3}`,
              qsk: `Q#${idQ3}#true#R#1`,
              gsi_pk: `Q#${idQ3}#true#R#1`,
              gsi_sk: `Q#${idQ3}#R#1`,
              generation: 1,
              run: 1,
              settings: {
                question: 'Jak vysoká je Šikmá věž v Pise?',
                image:
                  'https://images.unsplash.com/photo-1551981996-1e0aa26c5fba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2440&q=80',
                correctAnswer: 57,
                timeLimit: 20,
                unit: 'm',
              },
              strategy: {
                initialTips: [19, 89, 180],

                selectionPressure: [0.2],
                tipsPerGeneration: [5],
              },
              previousTips: [19, 89, 180],
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
                previousTips: [44, 310],
                time: 3000,
                createdBy: id1,
                createdAt: new Date().toISOString(),
                knewAnswer: false,
              },
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
                previousTips: [44, 310],
                time: 2000,
                createdBy: id2,
                createdAt: new Date().toISOString(),
                knewAnswer: false,
              },
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
                previousTips: [10, 377],
                time: 3000,
                createdBy: id3,
                createdAt: new Date().toISOString(),
                knewAnswer: false,
              },
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
                createdAt: new Date().toISOString(),
                knewAnswer: false,
              },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: `Q#${idQ3}`,
              qsk: `T#${idT5}`,
              gsi_pk: `Q#${idQ3}#R#1#G#1`,
              gsi_sk: `T#${idT5}`,
              run: 1,
              generation: 1,
              data: {
                tip: 3100,
                previousTips: [19, 89, 180],
                msElapsed: 4500,
                createdBy: id1,
                createdAt: new Date().toISOString(),
                knewAnswer: false,
              },
            },
          },
        },
      ],
    },
  };

  await db.batchWrite(paramsForUserBatch).promise();

  await db.batchWrite(paramsForUserBatch1).promise();
  await db.batchWrite(paramsForUserBatch2).promise();
  await db.batchWrite(paramsForUserBatch3).promise();
  await db.batchWrite(paramsForUserBatch4).promise();

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
