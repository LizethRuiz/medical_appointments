import models from '../../database/models';
import { create, findAll, findOne } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import message from '../utils/constants';
import { getDatesMonthInLocalZone, getRangeDayUTCfromLZ } from '../utils/dates';
import { TIME_ZONE } from '../../config/environment';

import { Op } from 'sequelize';

const Schedule = models.schedules;
const Doctor = models.doctors;

const getSchedule = async (req, res) => {
  try {
    const { query } = req;
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

      const { startUTC, endUTC } = await getDatesMonthInLocalZone(
        month,
        year,
        timeZone
      );

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

    const schedules = await findAll(data);

    return httpResponse(201, schedules, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

const createSchedule = async (req, res) => {
  try {
    const { body } = req;

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

const availabilitySchedule = async (date, doctorId, timeZone) => {
  try {
    let response = true;

    let data = {
      model: Schedule,
      where: { doctorId, deleted: false },
    };
    const { startUTC, endUTC } = await getRangeDayUTCfromLZ(date, timeZone);

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

    if (!findSchedule) response = false;

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export { getSchedule, createSchedule, availabilitySchedule };
