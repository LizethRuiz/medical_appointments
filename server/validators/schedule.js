import { validateResult } from '../utils/validators';
import message from '../utils/constants';

import { check } from 'express-validator';

const validate = [
  check('dates').isArray().withMessage(message.datesReq),
  check('dates.*.startDate').not().isEmpty().withMessage(message.startDateReq),
  check('dates.*.endDate').not().isEmpty().withMessage(message.endDateReq),
  check().custom(async (value, { req }) => {
    let { body, user } = req;

    body.doctorId = user.doctor.id;
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

export { validate };
