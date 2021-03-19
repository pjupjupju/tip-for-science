export function saveTip(context: any, { id, tip}: { id: string, tip: number }) {
  // TODO update tip table for ID with tip
  console.log(`--- updating Question ${id} with tip ${tip}`);

  return {
      id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
      question: "How much is the fleeb?",
      image: 'https://cdn.pixabay.com/photo/2013/07/28/12/23/paperclip-168336_1280.jpg',
      previousTips: [],
      correctAnswer: 15,
      unit: "kg",
    };
}