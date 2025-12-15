import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | SCIM` : 'SCIM'}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default SEO;
