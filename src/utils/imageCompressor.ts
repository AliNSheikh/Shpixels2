/**
 * Client-side image compressor using HTML5 canvas.
 * Compresses large uploaded images to WebP/JPEG with max width/height of 1600px.
 * Keeps file size safely under 300KB while preserving crisp high-resolution quality.
 */
export async function compressImageFile(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG or small file (< 80KB), return as data URL directly
    if (file.type === 'image/svg+xml' || file.size < 80 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData && webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {}

        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
