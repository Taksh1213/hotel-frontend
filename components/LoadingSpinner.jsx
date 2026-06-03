"use client";

export default function LoadingSpinner({ size = 12, text = "Loading..." }) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        role="status"
        className="animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
      {text && <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">{text}</p>}
    </div>
  );
}
