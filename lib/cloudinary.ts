export function cloudinaryImage(publicId: string, fallback: string, width = 1200) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const useCloudinary = process.env.NEXT_PUBLIC_USE_CLOUDINARY_ASSETS === "true";
  if (!cloudName || !useCloudinary) return fallback;
  const encoded = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,w_${width}/${encoded}`;
}
