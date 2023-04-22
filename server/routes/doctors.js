import { doctors } from '../controllers';
import { registryValidator, doctorValidator } from '../validators';
import { verifyToken } from '../middlewares/auth';

import { Router } from 'express';

const router = Router();

router
  .route('/registry')
  .post(
    registryValidator.commonValidate,
    doctorValidator.registry,
    doctors.createRegistry
  )
  .get(verifyToken, doctors.getDoctors);

module.exports = router;
