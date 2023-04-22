import { patients } from '../controllers';
import { registryValidator } from '../validators';

import { Router } from 'express';

const router = Router();

/** This is a common skeleton to name the final End Point of our services */

router
  .route('/registry')
  .post(registryValidator.commonValidate, patients.createRegistry);

module.exports = router;
