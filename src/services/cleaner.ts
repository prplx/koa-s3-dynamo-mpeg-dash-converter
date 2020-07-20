import fs from 'fs-extra';
import { stripFileExtension } from '../helpers';

class Cleaner {
  clean(objectKey: string): Promise<Error | null> {
    return new Promise(async (resolve, reject) => {
      try {
        await fs.remove(objectKey);
        await fs.remove(stripFileExtension(objectKey) as string);
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new Cleaner();
