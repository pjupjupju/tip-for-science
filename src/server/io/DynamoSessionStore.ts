import { DynamoDB } from 'aws-sdk';
import { Store, SessionData } from 'express-session';

interface SessionItem {
  id: string;
  expires: number | null; // unix timestamp in seconds, null in case there is no default time
  data: SessionData;
}

interface Options {
  dynamo?: DynamoDB.DocumentClient;
  tableName: string;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function isValidItem(item: any): item is SessionItem {
  if (item != null) {
    return true;
  }

  return false;
}

function isExpired(item: SessionItem): boolean {
  return item.expires == null ? false : Number(item.expires) <= nowSeconds();
}

function prolongSessionExpiration(session: SessionData): null | number {
  const now = nowSeconds();

  if (session.cookie) {
    if (session.cookie.maxAge != null) {
      return now + Math.floor(session.cookie.maxAge / 1000);
    }

    if (session.cookie.expires instanceof Date) {
      return Math.floor(session.cookie.expires.getTime() / 1000);
    }
  }

  return null;
}

export class DynamoSessionStore extends Store {
  client: DynamoDB.DocumentClient;

  table: string;

  constructor({ dynamo, tableName }: Options) {
    super();

    if (dynamo == null) {
      this.client = new DynamoDB.DocumentClient();
    } else {
      this.client = dynamo;
    }

    this.table = tableName;
  }

  get = async (
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ): Promise<void> => {
    try {
      const { Item } = await this.client
        .get({
          ConsistentRead: true,
          Key: {
            id: sid,
          },
          TableName: this.table,
        })
        .promise();

      if (!isValidItem(Item) || isExpired(Item)) {
        callback(undefined, undefined);
      } else {
        callback(undefined, Item.data);
      }
    } catch (e) {
      callback(e);
    }
  };

  set = async (
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> => {
    try {
      await this.client
        .put({
          Item: {
            id: sid,
            expires: prolongSessionExpiration(session),
            data: {
              ...session,
              __updatedAt: Date.now(),
            },
          },
          TableName: this.table,
        })
        .promise();

      if (callback) {
        callback();
      }
    } catch (e) {
      if (callback) {
        callback(e);
      }
    }
  };

  destroy = async (
    sid: string,
    callback?: (err?: any) => void
  ): Promise<void> => {
    try {
      await this.client
        .delete({
          Key: {
            id: sid,
          },
          TableName: this.table,
        })
        .promise();

      if (callback) callback();
    } catch (e) {
      if (callback) callback(e);
    }
  };

  touch = async (
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> => {
    try {
      this.client
        .update({
          Key: {
            id: sid,
          },
          UpdateExpression: 'set expires = :e, #d.#updated = :n',
          ExpressionAttributeNames: {
            '#updated': '__updatedAt',
            '#d': 'data',
          },
          ExpressionAttributeValues: {
            ':e': prolongSessionExpiration(session),
            ':n': Date.now(),
          },
          TableName: this.table,
        })
        .promise();

      if (callback) callback();
    } catch (e) {
      if (callback) callback(e);
    }
  };
}
