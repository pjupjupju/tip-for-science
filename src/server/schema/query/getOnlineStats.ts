import { GraphQLContext } from "..";

export async function getOnlineStats(
  parent: any,
  _: {},
  { runCache }: GraphQLContext,
) {
  const onlineData = runCache.getOnlineData();
 
  return { ...onlineData };
}
