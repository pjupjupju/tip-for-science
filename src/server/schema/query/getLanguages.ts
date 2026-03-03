import { findAllLanguages } from '../../model';
import { GraphQLContext } from '../context';

export async function getLanguages(parent: any, _: {}, context: GraphQLContext) {
  const languages = await findAllLanguages(context);

  return languages;
}
