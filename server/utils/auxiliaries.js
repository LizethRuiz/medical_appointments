import generatePwd from 'generate-password';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const { promisify } = require('util');

const encryptPassword = (password) => {
  let encPassword = bcrypt.hashSync(password, 10);

  return encPassword;
};

const generateToken = async () => {
  let token = generatePwd.generate({
    length: 20,
    numbers: true,
    lowercase: true,
    uppercase: true,
  });
  return token;
};

//File System Functiones became to async
const fileSystem = {
  stat: promisify(fs.stat),
  readFile: promisify(fs.readFile),
  unlink: promisify(fs.unlink),
  writeFile: promisify(fs.writeFile),
  exist: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  rmdir: promisify(fs.rm),
  readdir: promisify(fs.readdir),
};

export { fileSystem, encryptPassword, generateToken };
