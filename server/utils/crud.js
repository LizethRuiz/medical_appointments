import message from './constants';
import { getRangeDayLZfromUTC, getDatesMonthInLocalZone } from '../utils/dates';
import { zonedTimeToUtc } from 'date-fns-tz';
import { TIME_ZONE } from '../../config/environment';
import { isEmpty } from './nativeMethods';

import { Op } from 'sequelize';

const findOne = async (data) => {
  try {
    let found = await data.model.findOne(data);

    if (!found) throw new Error(`${message.elementNotFound}, 404`);

    return found;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async (data) => {
  try {
    data.order = data.order
      ? [...data.order, ['createdAt', 'DESC']]
      : [['createdAt', 'DESC']];

    let list = await data['model'].findAndCountAll(data);

    return list;
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (model, data) => {
  try {
    let registry = await model.create(data);

    return registry;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (model, id, data) => {
  try {
    let registry = await model.findOne({ where: { id, statusDelete: false } });

    if (!registry) throw new Error(`${message.elementNotFound}, 404`);

    registry.update(data);

    return registry;
  } catch (error) {
    throw new Error(error);
  }
};

const deleted = async (model, id) => {
  try {
    let registry = await model.findOne({ where: { id, statusDelete: false } });
    if (!registry) throw new Error(`${message.elementNotFound}, 404`);

    registry.update({ statusDelete: true });

    return message.elementDeleted;
  } catch (error) {
    throw new Error(error);
  }
};

const pagination = async (page, pageSize) => {
  try {
    page = page ? (page == 0 ? 1 : page) : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
  } catch (error) {
    throw new Error(error);
  }
};

const queryByDates = async (query, field) => {
  try {
    let response = null;
    if (
      (!isEmpty(query.month) && !isEmpty(query.year)) ||
      !isEmpty(query.date)
    ) {
      let dates = null;

      if (query.month && query.year) {
        dates = await getDatesMonthInLocalZone(query.month, query.year);
      }
      if (query.date) {
        dates = await getRangeDayLZfromUTC(query.date, LOCAL_ZONE);
      }

      if (dates) {
        let startDate = dates.startUTC;
        let finishDate = dates.finishUTC;

        response = [
          {
            [field]: {
              [Op.gte]: startDate,
            },
          },
          {
            [field]: {
              [Op.lt]: finishDate,
            },
          },
        ];
      }
    }
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const crudCascade = async (
  data,
  moduleInsert,
  findElement,
  foreignKey,
  valueForeignKey
) => {
  try {
    await moduleInsert.update(
      { statusDelete: true },
      { where: { [foreignKey]: valueForeignKey } }
    );

    for (let i = 0; i < data.length; i++) {
      let registry = data[i];
      registry[foreignKey] = valueForeignKey;
      registry['statusDelete'] = false;
      let elementAdded;

      let where = { [foreignKey]: valueForeignKey };

      if (findElement !== null)
        where = {
          [findElement]: registry[findElement],
          [foreignKey]: valueForeignKey,
        };

      let find = await moduleInsert.findOne({
        where: where,
      });

      if (find) {
        elementAdded = await find.update(registry);
      } else {
        elementAdded = await moduleInsert.create(registry);
      }

      data[i]['id'] = elementAdded.id;
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  create,
  findOne,
  findAll,
  update,
  deleted,
  crudCascade,
  pagination,
  queryByDates,
};
