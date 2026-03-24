import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteName = 'IzaanShop';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Premium educational products, books, and kids items in Bangladesh.';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || 'https://placehold.co/1200x630/FF6B35/white?text=IzaanShop'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image || 'https://placehold.co/1200x630/FF6B35/white?text=IzaanShop'} />
    </Helmet>
  );
};

export default SEO;
