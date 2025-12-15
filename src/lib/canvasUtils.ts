interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context available');
      }

      // Set canvas size to the cropped area size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped portion of the image
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(blob);
      }, 'image/jpeg', 0.9);
    };
  });
}

// Additional utility to get rotated image (for future use if needed)
export function getRotatedImage(imageSrc: string, rotation: number = 0): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context available');
      }

      const orientation = rotation > 90 || rotation < -90 ? 'portrait' : 'landscape';
      canvas.width = orientation === 'portrait' ? image.height : image.width;
      canvas.height = orientation === 'portrait' ? image.width : image.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);

      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
}
