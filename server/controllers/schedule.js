import models from '../../database/models';
import { create, findAll, findOne } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import message from '../utils/constants';
import { getDatesMonthInLocalZone, getRangeDayUTCfromLZ } from '../utils/dates';
import { TIME_ZONE } from '../../config/environment';

import { Op } from 'sequelize';

const Schedule = models.schedules;
const Doctor = models.doctors;

/** This controller permit to get a schedule's list ,
 * Query parameters:
 * To filter the schedule by month
 * - month
 * - year
 * - doctorId
 * - timeZone (local zone)
 * Responses:
 * 200 -> We get a 200 when the schedule's list
 */
const getSchedule = async (req, res) => {
  try {
    let { doctorId, month, year, timeZone } = req.query;

    let data = {
      model: Schedule,
      where: { deleted: false },
      order: [['startDate', 'DESC']],
      include: { model: Doctor },
    };

    if (doctorId) data.include.where = { id: doctorId };

    if (month) {
      year = year ? year : new Date().getFullYear();
      timeZone = timeZone ? timeZone : TIME_ZONE;

      /** We get a two dates, they are range of month UTC from Local Zone */
      const { startUTC, endUTC } = await getDatesMonthInLocalZone(
        month,
        year,
        timeZone
      );

      /**Add the conditions to filter according previos dates*/
      data.where[Op.or] = {
        startDate: {
          [Op.and]: {
            [Op.gte]: startUTC,
            [Op.lt]: endUTC,
          },
        },
        endDate: {
          [Op.and]: {
            [Op.gte]: startUTC,
            [Op.lt]: endUTC,
          },
        },
      };
    }

    /**Call function to make query in database */
    const schedules = await findAll(data);

    return httpResponse(201, schedules, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

/** This controller is used by doctors to make theirs schedules
 * Parameters in the body:
 * Object array, where each object containts the next properties
 * - startDate: Example -> 2023-04-21T13:00:00.000Z (UTC Date)
 * - endDate:Example -> 2023-04-21T21:00:00.000Z
 * In the database is saved the doctor id, this is obtained from  req user
 * Responses:
 * - 400 -> We get a 400 status when validators module raise exception
 * - 201 -> We get a 201 when the schedule was created
 */
const createSchedule = async (req, res) => {
  try {
    const { body } = req;

    /**For each element in array, create a registry in schedule table */
    body.dates.forEach(async (element) => {
      element.doctorId = body.doctorId;
      await create(Schedule, element);
    });

    return httpResponse(201, message.registrySuccess, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

/** This function is to check if a date is between a schedule
 * Parameters:
 * - date: Example -> 2023-04-21T00:00:00.000Z (UTC Date)
 * - doctorId:Example -> 1
 * Responses:
 * - True: When date is in schedule
 */
const availabilitySchedule = async (date, doctorId, timeZone) => {
  try {
    let response = true;

    let data = {
      model: Schedule,
      where: { doctorId, deleted: false },
    };

    /**With this funtions we get two dates according a date and specific time zone */
    const { startUTC, endUTC } = await getRangeDayUTCfromLZ(date, timeZone);

    /**Create the conditions to filter schedule between previos dates */
    data.where[Op.or] = {
      startDate: {
        [Op.and]: {
          [Op.gte]: startUTC,
          [Op.lt]: endUTC,
        },
      },
      endDate: {
        [Op.and]: {
          [Op.gte]: startUTC,
          [Op.lt]: endUTC,
        },
      },
    };

    let findSchedule = await findOne(data);

    /** When there aren't schedule the function returns false */
    if (!findSchedule) response = false;

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export { getSchedule, createSchedule, availabilitySchedule };
