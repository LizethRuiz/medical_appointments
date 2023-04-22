import { validationResult } from 'express-validator';
import { getResponse } from './responses';

const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();

    return next();
  } catch (e) {
    let { message } = getResponse({ message: e.array()[0].msg });
    res.status(400);
    res.send({ errors: message });
  }
};

export { validateResult };