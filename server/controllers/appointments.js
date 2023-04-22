/** Import local modules */
import models from '../../database/models';
import { create, findAll } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import message from '../utils/constants';

/** Import external modules */
import { Op } from 'sequelize';

/** Declare model names */
const Appointment = models.appointments;
const Doctor = models.doctors;
const Patient = models.patients;
const User = models.users;

/** This function permit to get a list of existing appointments of a specific doctor
 * that are crossed with in a range date
 * Parameters:
 * - startDate -> Example: 2023-04-21T19:20:00.000Z
 * - endDate -> Example:"2023-04-22T20:00:00.000Z"
 * - doctorId -> Example: 1
 * Response: We get appointments' list scheduled
 *  */
const findCrossedAppointment = async (startDate, endDate, doctorId) => {
  try {
    /** DataQuery is an object where properties permit to Sequelize
     * make the request to database, the properties are:
     * - model: We indicate the model that need to do a query
     * - where: Is the clause in SQL to condition the query, in this case use the Op or (from sequelize ORM)
     * to extract appointment tat can be crossed with start and end date
     */
    let dataQuery = {
      model: Appointment,
      where: {
        doctorId,
        canceled: false,
        [Op.or]: [
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
          {
            [Op.and]: [
              { startDate: { [Op.lt]: endDate } },
              { startDate: { [Op.gt]: startDate } },
            ],
          },
          {
            [Op.and]: [
              { endDate: { [Op.gt]: startDate } },
              { endDate: { [Op.lt]: endDate } },
            ],
          },
        ],
      },
    };

    /** findAll is a function (see the crud.js file in utils folder),
     * this receive data to do the request in database */
    const findAppointments = await findAll(dataQuery);

    return findAppointments;
  } catch (error) {
    throw new Error(error);
  }
};

/** This controller uses the previous function to get appointments crossed with dates and doctor parameters
 * Responses:
 * - 400 -> We get a 400 status when a appointment with start, end date and doctor isn't available
 * - 200 -> We get a 200 with a message "This schedule is available"
 */
const checkAvailability = async (req, res) => {
  try {
    let { startDate, endDate, doctorId } = req.body;

    /** The previous function  */
    let appointments = await findCrossedAppointment(
      startDate,
      endDate,
      doctorId
    );

    /** Appointmets list has count and rows properties,
     * where rows contains the elements and count the number of these
     * If count is not 0 indicate that there are appointments scheduled
     *  */
    if (appointments.count !== 0)
      return httpResponse(400, message.busySchedule, res);

    return httpResponse(200, message.availableSchedule, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

/** This controller permit add/schedule a new appointment
 * Parameters in the body:
 * - startDate: Example -> 2023-04-21T21:20:00.000Z (UTC Date)
 * - doctorId: Example -> 1
 * In the database is saved a endDate to appointment registry
 *  (This value is calculated taking the startDate and adding 40 minutes, duration for the appointment)
 * Responses:
 * - 400 -> We get a 400 status when validators module raise exception
 * - 201 -> We get a 201 when the appointment was created
 */
const createAppointment = async (req, res) => {
  try {
    const { body } = req;

    const appointment = await create(Appointment, body);

    return httpResponse(201, appointment, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

/** This controller permit to get a appointments' list according my rol,
 * - If I'm a patient I'm gonna get appointments with my patient Id
 * - if I'm a doctor I'm gonna get appointments with my doctor Id
 * The above is thanks to the user property in req that contains information about the user
 * Responses:
 * 201 -> We get a 200 when the appointments' list
 */
const getAppointments = async (req, res) => {
  try {
    const { user } = req;

    /** In the dataQuery the include property from Sequelize
     * permits add models associated with the main model */
    let dataQuery = {
      model: Appointment,
      where: { deleted: false },
      include: [
        {
          model: Patient,
          attributes: ['id'],
          include: { model: User, attributes: ['name', 'lastName', 'email'] },
        },
        {
          model: Doctor,
          attributes: ['id', 'license', 'speciality'],
          include: { model: User, attributes: ['name', 'lastName', 'email'] },
        },
      ],
      order: [['startDate', 'DESC']],
    };

    /** Condition in include to filter the appointments, when the user is doctor o patient */
    if (user.doctor) {
      dataQuery.include[1].where = {
        id: user.doctor.id,
      };
    }

    if (user.patient) {
      dataQuery.include[0].where = {
        id: user.patient.id,
      };
    }

    /**calling funtion tha make the request in database */
    const appointment = await findAll(dataQuery);

    return httpResponse(200, appointment, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

export {
  createAppointment,
  checkAvailability,
  findCrossedAppointment,
  getAppointments,
};
