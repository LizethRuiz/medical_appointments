import { validateResult } from '../utils/validators';
import message from '../utils/constants';
import { addMinutesToDate } from '../utils/dates';
import { findCrossedAppointment } from '../controllers/appointments';
import models from '../../database/models';

import { check } from 'express-validator';

const Doctor = models.doctors;
const durationAppointmentMin = 40;

/** These functions are executed before the controller to validate and prepare the data in body or req
 * use the express validator package to manage exceptions, there are many rules that you can use
 * like indicate if a property is empty and raise a error
 */

const validate = [
  check('startDate').not().isEmpty().withMessage(message.dateReq),
  check('doctorId').not().isEmpty().withMessage(message.doctorReq),
  check('doctorId').custom(async (value, { req }) => {
    let doctor = await Doctor.findOne({ where: { id: value, deleted: false } });

    if (!doctor) throw new Error(message.doctorNotFound);

    return value;
  }),
  check().custom(async (value, { req }) => {
    let { body } = req;
    let { user } = req;
    body.patientId = user.patient.id;
    body.endDate = addMinutesToDate(body.startDate, durationAppointmentMin);

    let crossedAppointments = await findCrossedAppointment(
      body.startDate,
      body.endDate,
      body.doctorId
    );

    if (crossedAppointments.rows.length !== 0)
      throw new Error(message.busySchedule);

    return true;
  }),
  check().custom(async (value, { req }) => {
    let { body } = req;

    if (body.id) delete body.id;
    body.deleted = false;
  }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export { validate };
