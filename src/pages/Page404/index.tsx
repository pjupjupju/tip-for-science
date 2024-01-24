import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

const Page404 = () => (
  <>
    <Helmet title="Nenalezeno"></Helmet>
    <h1 style={{ color: 'white', textAlign: 'center' }}>404</h1>
    <h3 style={{ textAlign: 'center' }}>
      <NavLink to="/" style={{ color: 'white', textAlign: 'center' }}>
        <FormattedMessage id="app.404.footer.home"
          defaultMessage="Home 🏠"
          description="Home button" />
      </NavLink>
    </h3>
  </>
);

export { Page404 };
