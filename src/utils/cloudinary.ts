import mapping from "./cloudinary-mapping.json";

/**
 * Resolves a local asset path to its remote Cloudinary CDN URL from the pre-uploaded mapping.
 * Falls back to the original local path if no match is found or during development.
 * 
 * @param localPath The local asset path (e.g. "/Logo/Logo Pondok Pesantren.png" or "pesantren_hero.png")
 * @returns The optimized Cloudinary URL or the original local path
 */
export function getCloudinaryUrl(localPath: string): string {
  if (!localPath) return "";

  // Normalize the path by adding a leading slash if missing
  const normalizedPath = localPath.startsWith("/") ? localPath : "/" + localPath;
  
  // Look up the URL in our generated JSON mapping
  const mappedUrl = (mapping as Record<string, string>)[normalizedPath];
  
  if (mappedUrl) {
    return mappedUrl;
  }

  // Fallback to local path if not found
  return localPath;
}
