import { validateResult } from '../utils/validators';
import message from '../utils/constants';

import { check } from 'express-validator';

const registry = [
  check('state').not().isEmpty().withMessage(message.stateReq),
  check('city').not().isEmpty().withMessage(message.cityReq),
  check('fullAddress').not().isEmpty().withMessage(message.addressReq),
  check('speciality').not().isEmpty().withMessage(message.specialityReq),
  check('license')
    .not()
    .isEmpty()
    .withMessage(message.licenseReq)
    .isLength({ min: 7, max: 8 })
    .withMessage(message.invalidLicense),
  check().custom(async (value, { req }) => {
    let { body } = req;

    if (body.id) delete body.id;
    body.deleted = false;
  }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export { registry };
