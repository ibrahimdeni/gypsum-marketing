import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'GypsumPro - Premium Quality Gypsum Products',
  description = 'Professional Gypsum Marketing Website with E-commerce features. Premium quality gypsum boards, ceiling tiles, and accessories.',
  keywords = 'gypsum, gypsum board, ceiling tiles, construction',
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  product = null,
}) => {
  const siteUrl = 'https://gypsumpro.com';
  const fullUrl = `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Product structured data
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.[0]?.url || fullImage,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "IDR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  } : null;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Product Structured Data */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;