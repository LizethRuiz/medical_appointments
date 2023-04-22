import { appointments } from '../controllers';
import { appointmentValidator } from '../validators';
import { verifyToken, checkPermissions } from '../middlewares/auth';

import { Router } from 'express';

const router = Router();

router
  .route('/')
  .post(
    verifyToken,
    checkPermissions('patient'),
    appointmentValidator.validate,
    appointments.createAppointment
  )
  .get(verifyToken, appointments.getAppointments);

router
  .route('/availability')
  .post(
    verifyToken,
    checkPermissions('patient'),
    appointments.checkAvailability
  );

module.exports = router;
