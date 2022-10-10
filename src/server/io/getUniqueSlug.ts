import {
  uniqueNamesGenerator,
  Config,
  adjectives,
} from 'unique-names-generator';
import { adverbs, nouns } from './words';

const customConfig: Config = {
  dictionaries: [adverbs, adjectives, nouns],
  separator: '-',
  length: 3,
};

const getUniqueSlug = (seed: string | number): string =>
  uniqueNamesGenerator({ ...customConfig, seed });

export { getUniqueSlug };
