import { IMAGE_PROCESSING } from '../constants/appConstants';

/**
 * Optimized image processing pipeline that minimizes conversions
 */
export class OptimizedImageProcessor {
  private static readonly CONFIG = IMAGE_PROCESSING;

  /**
   * Process image directly from blob to compressed blob without base64 conversion
   */
  static async compressBlobDirect(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        try {
          const { width, height } = this.calculateDimensions(img.width, img.height);
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (compressedBlob) => {
              if (compressedBlob) {
                resolve(compressedBlob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            `image/${this.CONFIG.OUTPUT_FORMAT}`,
            this.CONFIG.COMPRESSION_QUALITY
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Calculate optimal dimensions maintaining aspect ratio
   */
  private static calculateDimensions(originalWidth: number, originalHeight: number) {
    const ratio = Math.min(
      this.CONFIG.MAX_WIDTH / originalWidth,
      this.CONFIG.MAX_HEIGHT / originalHeight
    );

    // Only resize if image is larger than max dimensions
    if (ratio >= 1) {
      return { width: originalWidth, height: originalHeight };
    }

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }

  /**
   * Check if WebP format is supported
   */
  static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Get the best supported image format
   */
  static getOptimalFormat(): string {
    return this.supportsWebP() ? 'webp' : 'jpeg';
  }
}