import React from 'react';
import { useQuery } from '@apollo/client';
import { redirect } from 'react-router-dom';
import { Container } from './../../components/Container';
import { Questionnaire } from '../../components/Questionnaire';
import { QUESTIONNAIRE_QUERY } from '../../gql';
import { Spinner } from '../../components';

const Ipip = ({ user }) => {
  const { loading, data, networkStatus } = useQuery(QUESTIONNAIRE_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  console.log('data', data);

  if (!user) {
    redirect('/');
  }

  if (loading || !data.getQuestionnaire) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container>
      <Questionnaire questionnaire={data.getQuestionnaire}  />
    </Container>
  );
};

export { Ipip };
