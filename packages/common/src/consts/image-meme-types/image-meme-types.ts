import * as mime from 'mime-types';

const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'tiff',
  'tif',
  'ico',
  'heic',
  'heif',
  'avif',
];

export const IMAGE_MEME_TYPES = imageExtensions
  .map((ext) => mime.lookup(ext))
  .filter((type): type is string => typeof type === 'string'); // Filter out false values
