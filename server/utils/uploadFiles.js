import fs from 'fs';
import path from 'path';
import { fileSystem } from './auxiliaries';

export async function fileUpload(file, namePath, name, ext) {
  try {
    let matches = file.match(/^data:(.+);base64,(.+)$/);

    if (matches.length !== 3) return new Error('Invalid input string');

    let response = {};

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    let imageBuffer = response.data;
    let extension = response.type.split('/');
    extension = extension[1].split('+');
    extension = extension[0];

    if (
      !fs.existsSync(`${path.dirname(require.main.filename)}/server${namePath}`)
    ) {
      await fileSystem.mkdir(
        `${path.dirname(require.main.filename)}/server${namePath}`
      );
    }

    let fileName;

    extension = ext ? ext : extension;

    if (!name) {
      fileName = `${Date.now()}.${extension}`;
    } else {
      fileName = `${name}.${extension}`;
    }

    let fileRoute = `${namePath}/${fileName}`;

    fs.writeFileSync(
      `${path.dirname(require.main.filename)}/server${fileRoute}`,
      imageBuffer,
      {
        encoding: 'utf8',
      }
    );

    return fileRoute;
  } catch (error) {
    throw new Error('Ha ocurrido un error al cargar la imagen');
  }
}
