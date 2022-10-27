import { adjectives, adverbs, nouns } from './words';

const getUniqueSlug = (index: number): string => {
  const adverb = adverbs[(index + 161) % adverbs.length];
  const adjective = adjectives[(index + 16) % adjectives.length];
  const noun = nouns[(index + 1) % nouns.length];

  return `${adverb}-${adjective}-${noun}`;
};

export { getUniqueSlug };
