import React from 'react';
import { useQuery } from '@apollo/client';
import { Container } from './../../components/Container';
import { Questionnaire } from '../../components/Questionnaire';
import { QUESTIONNAIRE_QUERY } from '../../gql';
import { Spinner } from '../../components';

const Ipip = ({ onQuestionnaireFinish, user }) => {
  const { loading, data } = useQuery(QUESTIONNAIRE_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  if (loading || !data.getQuestionnaire) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container>
      <Questionnaire
        completeBundle={user.ipipBundle}
        questionnaire={data.getQuestionnaire}
        onFinish={onQuestionnaireFinish}
      />
    </Container>
  );
};

export { Ipip };
