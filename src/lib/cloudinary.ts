/**
 * Cloudinary Configuration & Upload Helpers
 * 
 * Handles image upload to Cloudinary for product images.
 * Uses the Cloudinary Node.js SDK for server-side uploads.
 */
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded file string or URL
 * @param folder - Cloudinary folder to upload to
 * @returns Upload result with secure_url and public_id
 */
export async function uploadImage(
  file: string,
  folder: string = 'glow-up/products'
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Generate an optimized Cloudinary URL with transformations
 * @param publicId - The public_id of the image
 * @param options - Transformation options
 */
export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const { width = 800, height = 800, quality = 'auto' } = options;

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width, height, crop: 'fill', gravity: 'auto' },
      { quality, fetch_format: 'auto' },
    ],
  });
}

export default cloudinary;
