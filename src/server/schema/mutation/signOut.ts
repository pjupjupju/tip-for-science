import { GraphQLContext } from '../context';

export async function signOut(
  parent: any,
  args: any,
  context: GraphQLContext,
): Promise<{ viewer: any }> {
  if (context.request.session) {
    await new Promise((resolve, reject) => {
      context.request.session!.destroy((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }

  context.user = undefined;

  return {
    viewer: {},
  };
}
