import { IMAGE_PROCESSING } from '../constants/appConstants';

/**
 * Comprimeert een base64-gecodeerde afbeelding met behulp van een canvas.
 * Gebruikt WebP format voor betere compressie met behoud van kwaliteit.
 * @param base64Str De base64 data-URL van de afbeelding.
 * @param quality Een getal tussen 0 en 1 dat de gewenste beeldkwaliteit aangeeft.
 * @returns Een Promise die wordt omgezet in de base64 data-URL van de gecomprimeerde afbeelding.
 */
export const compressBase64Image = (base64Str: string, quality: number = IMAGE_PROCESSING.COMPRESSION_QUALITY): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Geoptimaliseerde afmetingen voor betere kwaliteit
      const MAX_WIDTH = IMAGE_PROCESSING.MAX_WIDTH;
      const MAX_HEIGHT = IMAGE_PROCESSING.MAX_HEIGHT;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Kon geen canvas context verkrijgen.'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Gebruik WebP voor betere compressie
      resolve(canvas.toDataURL(`image/${IMAGE_PROCESSING.OUTPUT_FORMAT}`, quality));
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Converteert een data URL (base64) naar een Blob object.
 * @param dataurl De base64 data URL.
 * @returns Een Blob object.
 */
export const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}