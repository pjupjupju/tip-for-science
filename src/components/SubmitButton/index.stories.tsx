import React from 'react';
import { SubmitButton } from '.';

export default {
  title: 'components/SubmitButton',
  component: SubmitButton,
};

export const withTimeLimit = () => <SubmitButton timeLimit={10} />;
export const noTimeLimit = () => <SubmitButton>submit</SubmitButton>;

withTimeLimit.storyName = 'Submit button with time limit';
noTimeLimit.storyName = 'Submit button with no time limit';
