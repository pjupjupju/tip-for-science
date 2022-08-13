import React from 'react';
import Helmet from 'react-helmet';
import { Text } from 'rebass';
import { Container } from './../../components/Container';

const Consent = () => (
  <Container>
    <Helmet title="Souhlas s podmínkami"></Helmet>
    <Text color="secondary" my="6">
      Tímto uděluji souhlas Bc. Pavlíně Hillerové (hillerovap@natur.cuni.cz),
      která je správcem osobních údajů, se zpracováním svých osobních údajů
      v rozsahu
      <br />
      -  emailová adresa
      <br />
      -  osobních údajů, které vyplynou z odpovědí na v dotaznících uvedené
      otázky
      <br />
      za účelem studie kulturního přenosu pro diplomovou práci.
      <br />
      <br />
      Beru na vědomí, že
      <br />
      -  mi budou zasílány informace na uvedenou e-mailovou adresu,
      <br />
      -  mám práva: o požádat o informaci, jaké osobní údaje jsou o mé osobě
      zpracovávány,
      <br />
      -  požadovat opravu osobních údajů, pokud jsou neplatné nebo zastaralé,
      <br />
      -  požadovat, aby nebyly moje osobní údaje zpracovávány do doby, než bude
      vyřešena oprávněnost výše uvedených požadavků,
      <br />
      -  podat stížnost u dozorového úřadu,
      <br />
      -  souhlas kdykoli odvolat zrušením svého profilu zasláním e-mailu na
      adresu hillerovap@natur.cuni.cz.
    </Text>
  </Container>
);

export { Consent };
