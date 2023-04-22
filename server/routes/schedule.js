import { schedules } from '../controllers';
import { scheduleValidator } from '../validators';
import { checkPermissions, verifyToken } from '../middlewares/auth';

import { Router } from 'express';

const router = Router();

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
