import { patients } from '../controllers';
import { registryValidator } from '../validators';

import { Router } from 'express';

const router = Router();

router
  .route('/registry')
  .post(registryValidator.commonValidate, patients.createRegistry);

module.exports = router;
