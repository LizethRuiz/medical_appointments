import { login } from '../controllers';
import { loginValidator } from '../validators';

import { Router } from 'express';

const router = Router();

router.route('/').post(loginValidator.validate, login.signIn);

module.exports = router;
