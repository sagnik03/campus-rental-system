const getBackendBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return apiBase.replace(/\/api\/?$/, '');
};

const BLACK_FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221280%22 height%3D%22800%22 viewBox%3D%220 0 1280 800%22%3E%3Crect width%3D%221280%22 height%3D%22800%22 fill%3D%22%23000000%22/%3E%3C/svg%3E';

const CATEGORY_FALLBACKS = [
  {
    keywords: ['electronics', 'gaming', 'laptop', 'phone', 'tablet', 'console', 'camera'],
    imageUrl:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['study', 'books', 'book', 'calculator', 'stationery', 'notes'],
    imageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['sports', 'fitness', 'gym', 'cycle', 'bicycle', 'football', 'cricket'],
    imageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['furniture', 'chair', 'table', 'mattress', 'bed'],
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['music', 'guitar', 'keyboard', 'piano', 'speaker', 'mic'],
    imageUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  },
];

const getCategoryFallbackImage = (category) => {
  const normalizedCategory = String(category || '').toLowerCase().trim();

  if (!normalizedCategory) {
    return BLACK_FALLBACK_IMAGE;
  }

  const matchedCategory = CATEGORY_FALLBACKS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedCategory.includes(keyword)),
  );

  if (!matchedCategory) {
    return BLACK_FALLBACK_IMAGE;
  }

  return matchedCategory.imageUrl;
};

export const getImageUrl = (imagePath, category) => {
  if (!imagePath) {
    return getCategoryFallbackImage(category);
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return `${getBackendBaseUrl()}${imagePath}`;
  }

  return `${getBackendBaseUrl()}/${imagePath}`;
};
