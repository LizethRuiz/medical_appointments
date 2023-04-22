import { validateResult } from '../utils/validators';
import message from '../utils/constants';
import models from '../../database/models';

import { check } from 'express-validator';

const commonValidate = [
  check('name').not().isEmpty().withMessage(message.nameReq),
  check('lastName').not().isEmpty().withMessage(message.lastNameReq),
  check('email')
    .not()
    .isEmpty()
    .withMessage(message.emailReq)
    .isEmail()
    .withMessage(message.invalidEmail),
  check('password').not().isEmpty().withMessage(message.passwordReq),
  check('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage(message.invalidPassword),
  check('phone').not().isEmpty().withMessage(message.phoneReq),
  check('phone').optional().isLength(10).withMessage(message.invalidPassword),
  check().custom(async (value, { req }) => {
    let { body } = req;
    let alreadyExistEmail = null;

    alreadyExistEmail = await models.users.findOne({
      where: { email: body.email, deleted: false },
    });

    if (alreadyExistEmail) throw new Error(message.userEmailAlreadyExist);
  }),
  check().custom(async (value, { req }) => {
    let { body } = req;

    if (body.id) delete body.id;
    body.deleted = false;
  }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export { commonValidate };
