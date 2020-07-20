import { URL } from 'url';

export const getS3ObjectKeyFromURL = (url: any): string | null => {
  if (typeof url !== 'string') return null;

  let urlObject;
  try {
    urlObject = new URL(url);
  } catch (error) {
    return null;
  }
  return urlObject.pathname.slice(1);
};

export const stripFileExtension = (url: any): string | null => {
  if (typeof url !== 'string') return null;

  return url.replace(/\.[^/.]+$/, '');
};
