import React from 'react';

const questionnaire = [
  { id: 12, item: 'Myslím si že flopec není úplný dingus.' },
  { id: 15, item: 'Někdy chci pejsku prodat na maso.' },
  { id: 34, item: 'Šmobjulok.' },
];

const Questionnaire = () => {
  return (
    <div>
      {questionnaire.map((question) => (
        <p key={question.id}>{question.item}</p>
      ))}
    </div>
  );
};

export { Questionnaire };
