import { login } from '../controllers';
import { loginValidator } from '../validators';

import { Router } from 'express';

const router = Router();

/** This is a common skeleton to name the final End Point of our services */
router.route('/').post(loginValidator.validate, login.signIn);

module.exports = router;
