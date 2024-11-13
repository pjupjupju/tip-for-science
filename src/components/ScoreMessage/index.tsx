import { FormattedMessage } from 'react-intl';

const types = {
  'score.top': 6,
  'score.high': 5,
  'score.low': 5,
  'score.zero': 8,
};

interface ScoreMessageProps {
  scoreType: keyof typeof types;
}

const getRandomScoreId = (scoreType) => {
  const randomIndex = Math.floor(Math.random() * types[scoreType]);
  return `${scoreType}.${randomIndex}`;
};

const ScoreMessage = ({ scoreType }: ScoreMessageProps) => (
  <FormattedMessage id={getRandomScoreId(scoreType)} />
);

export default ScoreMessage;
