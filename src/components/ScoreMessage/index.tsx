import { defineMessages, useIntl } from 'react-intl';

const types = {
  'score.top': 6,
  'score.high': 5,
  'score.low': 5,
  'score.zero': 8,
};

const messages = defineMessages({
  'score.top.0': { id: 'score.top.0', defaultMessage: 'Wow! 🥳' },
  'score.top.1': {
    id: 'score.top.1',
    defaultMessage: 'Not cheating, are you? 👀',
  },
  'score.top.2': { id: 'score.top.2', defaultMessage: 'Mind-blowing! 😮' },
  'score.top.3': { id: 'score.top.3', defaultMessage: 'Hats off to you!' },
  'score.top.4': { id: 'score.top.4', defaultMessage: '👑 You dropped this!' },
  'score.top.5': { id: 'score.top.5', defaultMessage: 'Jackpot!' },
  'score.high.0': {
    id: 'score.high.0',
    defaultMessage: "Someone's got a knack for this 😳",
  },
  'score.high.1': { id: 'score.high.1', defaultMessage: 'Nicely done! 🤓' },
  'score.high.2': { id: 'score.high.2', defaultMessage: 'Epic! 🥸' },
  'score.high.3': { id: 'score.high.3', defaultMessage: 'Awesome!' },
  'score.high.4': { id: 'score.high.4', defaultMessage: 'Well played!' },
  'score.low.0': { id: 'score.low.0', defaultMessage: 'Almost there 😉' },
  'score.low.1': {
    id: 'score.low.1',
    defaultMessage: 'Not great, not terrible 🙃',
  },
  'score.low.2': {
    id: 'score.low.2',
    defaultMessage: 'Decent for an amateur 😏',
  },
  'score.low.3': { id: 'score.low.3', defaultMessage: 'Hmm!' },
  'score.low.4': {
    id: 'score.low.4',
    defaultMessage: 'Like... yeah, but not quite',
  },
  'score.zero.0': { id: 'score.zero.0', defaultMessage: 'Whoops 🙈' },
  'score.zero.1': {
    id: 'score.zero.1',
    defaultMessage: "That didn't quite work out",
  },
  'score.zero.2': {
    id: 'score.zero.2',
    defaultMessage: 'Are you even trying? 🧐',
  },
  'score.zero.3': { id: 'score.zero.3', defaultMessage: 'Maybe next time!' },
  'score.zero.4': {
    id: 'score.zero.4',
    defaultMessage: "🤏 This close... maybe you'll get next time.",
  },
  'score.zero.5': { id: 'score.zero.5', defaultMessage: 'Hm.' },
  'score.zero.6': {
    id: 'score.zero.6',
    defaultMessage: 'This one missed the mark.',
  },
  'score.zero.7': { id: 'score.zero.7', defaultMessage: '🤨' },
});

interface ScoreMessageProps {
  scoreType: keyof typeof types;
}

const getRandomScoreId = (
  scoreType: keyof typeof types
): keyof typeof messages => {
  const randomIndex = Math.floor(Math.random() * types[scoreType]);
  return `${scoreType}.${randomIndex}` as keyof typeof messages;
};

const ScoreMessage = ({ scoreType }: ScoreMessageProps) => {
  const intl = useIntl();
  return <>{intl.formatMessage(messages[getRandomScoreId(scoreType)])}</>;
};

export default ScoreMessage;
