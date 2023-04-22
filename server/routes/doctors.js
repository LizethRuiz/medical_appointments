import { doctors } from '../controllers';
import { registryValidator, doctorValidator } from '../validators';
import { verifyToken } from '../middlewares/auth';

import { Router } from 'express';

const router = Router();

/** This is a common skeleton to name the final End Point of our services */

router
  .route('/registry')
  .post(
    registryValidator.commonValidate,
    doctorValidator.registry,
    doctors.createRegistry
  )
  .get(verifyToken, doctors.getDoctors);

module.exports = router;
