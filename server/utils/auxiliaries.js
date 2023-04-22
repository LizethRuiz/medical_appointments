import bcrypt from 'bcryptjs';

/** This function use the bcrypt package to encrypt a string */
const encryptPassword = (password) => {
  let encPassword = bcrypt.hashSync(password, 10);

  return encPassword;
};

export { encryptPassword };
