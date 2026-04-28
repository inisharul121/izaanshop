const formatProduct = (product) => {
  if (!product) return null;
  const p = { ...product };

  // Handle images with robust fallbacks
  const defaultPlaceholder = '/placeholder.png';
  if (p.images) {
    try {
      p.images = typeof p.images === 'object' ? p.images : JSON.parse(p.images);
      if (!p.images.main || p.images.main === '' || p.images.main === '/placeholder.png') {
        p.images.main = defaultPlaceholder;
      }
      if (!Array.isArray(p.images.gallery)) {
        p.images.gallery = [];
      }
    } catch (e) {
      p.images = { main: defaultPlaceholder, gallery: [] };
    }
  } else {
    p.images = { main: defaultPlaceholder, gallery: [] };
  }

  // Handle attributes
  if (p.attributes) {
    p.attributes = p.attributes.map(attr => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }));
  }
  if (p.variants) {
    p.variants = p.variants.map(variant => ({
      ...variant,
      options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options
    }));
  }
  return p;
};

module.exports = formatProduct;
