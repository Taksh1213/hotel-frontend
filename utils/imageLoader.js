// Image loader utilities for optimization

export const blurDataURL =
  'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';

// Fallback placeholder for failed images
export const placeholderImage = '/no-image.png';

// Image error handler
export const handleImageError = (e) => {
  e.target.src = placeholderImage;
};

// Check if image URL is valid before rendering
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
