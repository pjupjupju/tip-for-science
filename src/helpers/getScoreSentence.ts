const topScoreSentence = [
  'Wow! 🥳',
  'Nepodvádíš? 👀',
  'Dechberoucí! 😮',
  'Smekám!',
  '👑 něco ti spadlo!',
  'Jackpot!',
];
const highScoreSentence = [
  'Tady má někdo odhad 😳',
  'Dobře ty! 🤓',
  'Epické! 🥸',
  'Super!',
  'Výtečně!',
];
const lowScoreSentence = [
  'Skoro 😉',
  'Not great, not terrible 🙃',
  'Slušný, na amatéra 😏',
  'Hmm!',
  'Skoro!',
];
const zeroScoreSentence = [
  'Whoops 🙈',
  'Tak tohle nevyšlo.',
  'Snažíš se vůbec? 🧐',
  'Tak třeba příště.',
  '🤏 Takhle blízko... se třeba trefíš příště.',
  'Hm.',
  'Tohle se moc nepovedlo.',
  '🤨',
];

const getScoreSentence = (sentences: string[]) => {
  return sentences[Math.floor(Math.random() * sentences.length)];
};

export {
  getScoreSentence,
  topScoreSentence,
  highScoreSentence,
  lowScoreSentence,
  zeroScoreSentence,
};
