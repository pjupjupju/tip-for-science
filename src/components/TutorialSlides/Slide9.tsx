import React, { KeyboardEvent, useRef } from 'react';
import { Flex, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import washington from './../../assets/washingtonTut.jpg';
import { PreviousTips } from '../Game/PreviousTips';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import { SlideProps } from './types';
import { SubmitButton } from '../SubmitButton';
import { FormattedMessage, useIntl } from 'react-intl';

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const imageStyle = {
  maxWidth: '100%',
  alignSelf: 'center',
  objectFit: 'contain',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const image = washington;
const previousTips = [28, 105];

const Slide9 = ({ onSubmit = () => {} }: SlideProps) => {
  const intl = useIntl();
  const question = intl.formatMessage({
    id: 'app.tutorial.slide.washingtonq',
    defaultMessage: "How tall is George Washington's head in the Mt. Rushmore?",
    description: 'Tut9 washington question',
  });
  const unit = intl.formatMessage({
    id: 'app.tutorial.slide.meter',
    defaultMessage: 'm',
    description: 'Tut9 meter',
  });
  const placeholder = intl.formatMessage({
    id: 'app.yourtip',
    defaultMessage: 'your tip',
    description: 'Yourtip placeholder',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickSubmit = () => {
    onSubmit(Number(inputRef.current!.value));
  };
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      ![
        'Shift',
        'ArrowLeft',
        'ArrowRight',
        'Backspace',
        'Enter',
        '.',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ].includes(event.key)
    ) {
      event.preventDefault();
    }

    if (event.key === 'Enter') {
      onSubmit(Number(event.currentTarget.value));
    }
  };

  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[3, 4, 5]} color="secondary" textAlign="center" p={3}>
          <FormattedMessage
            id="app.tutorial.slide.previousp"
            defaultMessage="Now you also have the previous tips available as a potential hint:"
            description="Tut9 previousp"
          />
          <br />
          {question}
        </Text>
      </TutorialHeader>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} />
      <Flex justifyContent="center" alignItems="baseline" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          <FormattedMessage
            id="app.tip"
            defaultMessage="tip:"
            description="Tip"
          />
        </Label>
        <Input
          id="tip"
          name="tip"
          type="number"
          placeholder={placeholder}
          sx={inputStyles}
          onKeyDown={handleSubmit}
          ref={inputRef}
        />
        <Text color="white" mr={2}>
          {unit}
        </Text>{' '}
        <SubmitButton onClick={handleClickSubmit} />
      </Flex>
    </Container>
  );
};

export { Slide9 };
