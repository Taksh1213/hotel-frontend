export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://hotel-backend-frrj.onrender.com";

export const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Remove backslashes and normalize path
  const path = String(imagePath).replace(/\\/g, "/").trim();

  // If already an external URL, fix localhost references
  if (path.startsWith("http")) {
    let normalizedUrl = path
      .replace("http://localhost:5000", BACKEND_ORIGIN)
      .replace("https://localhost:5000", BACKEND_ORIGIN)
      .replace("http://127.0.0.1:5000", BACKEND_ORIGIN)
      .replace("https://127.0.0.1:5000", BACKEND_ORIGIN);

    // Ensure it's HTTPS on production
    if (!normalizedUrl.startsWith("https://")) {
      normalizedUrl = normalizedUrl.replace("http://", "https://");
    }

    return normalizedUrl;
  }

  // For relative paths, combine with backend origin
  const cleanPath = path.replace(/^\/+/, "");
  return `${BACKEND_ORIGIN}/${cleanPath}`;
};
