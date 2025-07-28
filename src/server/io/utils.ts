type RunConfig = {
  tipsPerGeneration: number;
  selectionPressure: number;
  numTipsToShow: number;
};

const getGenerationSize = (r: number): number => {
  if (r < (6 / 13) * 0.95) {
    return 8;
  } else if (r < (4 / 13) * 0.95) {
    return 12;
  } else if (r < (3 / 13) * 0.95) {
    return 16;
  } else {
    return 1; // 5% chance
  }
};

const getSelectionPressure = (generationSize: number): number => {
  if (generationSize === 1) {
    return 0;
  }

  const options = [0, 0.25, 0.5];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
};

const getSurvivorsSize = (generationSize: number): number => {
  if (generationSize === 1) {
    return 0;
  }

  const r = Math.random();
  const p0 = 0.05;
  const normalizationOffset = 1 - p0;
  const p1 = 0.1 / normalizationOffset;
  const p2 = 0.35 / normalizationOffset;
  const p3 = 0.35 / normalizationOffset;

  if (r < p1) {
    return 1;
  } else if (r < p1 + p2) {
    return 2;
  } else if (r < p1 + p2 + p3) {
    return 3;
  } else {
    return 4;
  }
};

export const getRunConfig = (): RunConfig => {
  const r = Math.random();
  const tipsPerGeneration = getGenerationSize(r);
  const selectionPressure = getSelectionPressure(tipsPerGeneration);
  const numTipsToShow = getSurvivorsSize(r);

  return {
    tipsPerGeneration,
    selectionPressure,
    numTipsToShow,
  };
};
