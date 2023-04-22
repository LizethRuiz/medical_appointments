import { validateResult } from '../utils/validators';
import message from '../utils/constants';

import { check } from 'express-validator';

const validate = [
  check('email')
    .not()
    .isEmpty()
    .withMessage(message.emailReq)
    .isEmail()
    .withMessage(message.invalidEmail),
  check('password')
    .not()
    .isEmpty()
    .withMessage(message.passwordReq)
    .isLength({ min: 8 })
    .withMessage(message.invalidPassword),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export { validate };
