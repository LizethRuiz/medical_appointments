import { schedules } from '../controllers';
import { scheduleValidator } from '../validators';
import { checkPermissions, verifyToken } from '../middlewares/auth';

import { Router } from 'express';

const router = Router();

/** This is a common skeleton to name the final End Point of our services */

router
  .route('/')
  .post(
    verifyToken,
    checkPermissions('doctor'),
    scheduleValidator.validate,
    schedules.createSchedule
  )
  .get(verifyToken, schedules.getSchedule);

module.exports = router;
