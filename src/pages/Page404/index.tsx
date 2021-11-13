import React from 'react';
import { NavLink } from 'react-router-dom';

const Page404 = () => (
  <>
    <h1 style={{ color: 'white', textAlign: 'center' }}>404</h1>
    <h3 style={{ textAlign: 'center' }}>
      <NavLink to="/" style={{ color: 'white', textAlign: 'center'}}>
        Domů 🏚
      </NavLink>
    </h3>
  </>
);

export { Page404 };