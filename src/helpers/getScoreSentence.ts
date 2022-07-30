const topScoreSentence = ["Wow! 🥳", "Nepodvádíš? 👀", "Dechberoucí! 😮"];
const highScoreSentence = ["Tady má někdo odhad 😳", "Dobře ty! 🤓", "Nepodvádíš? 👀", "Epické! 🥸"];
const lowScoreSentence = ["Skoro 😉", "Not great, not terrible 🙃", "Slušný, na amatéra 😏"];
const zeroScoreSentence = ["Whoops 💩", "Tak tohle nevyšlo 🙃", "Snažíš se vůbec? 🧐", "Tak třeba příště 🤡"];

const getScoreSentence = ( sentences: string[] ) => {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

export { getScoreSentence, topScoreSentence, highScoreSentence, lowScoreSentence, zeroScoreSentence };