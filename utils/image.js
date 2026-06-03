export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://hotel-backend-frrj.onrender.com";

export const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return null;

  const path = imagePath.replace(/\\/g, "/");

  if (path.startsWith("http")) {
    return path
      .replace("http://localhost:5000", BACKEND_ORIGIN)
      .replace("https://localhost:5000", BACKEND_ORIGIN)
      .replace("http://127.0.0.1:5000", BACKEND_ORIGIN)
      .replace("https://127.0.0.1:5000", BACKEND_ORIGIN);
  }

  return `${BACKEND_ORIGIN}/${path.replace(/^\/+/, "")}`;
};
