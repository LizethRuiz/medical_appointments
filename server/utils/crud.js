import message from './constants';

/**This function permit to get a instance of model, calling the findOne function sequelize
 * Parameters:
 * data object with properties and values to make query in database, as model, where, attributes, order, include
 * Response:
 * Raise an error when element not found
 * Response the instance
 */
const findOne = async (data) => {
  try {
    let found = await data.model.findOne(data);

    if (!found) throw new Error(`${message.elementNotFound}, 404`);

    return found;
  } catch (error) {
    throw new Error(error);
  }
};

/**This function permit to get a list of a table, calling the findAll funtion sequelize
 * Parameters:
 * data object with properties and values to make query in database, as model, where, attributes, order, include
 * Response:
 * Response the list in properties count:Number of elements and rows: elements' list
 */
const findAll = async (data) => {
  try {
    //Order the element by createdAt attribute if order property in data is not
    data.order = data.order
      ? [...data.order, ['createdAt', 'DESC']]
      : [['createdAt', 'DESC']];

    let list = await data['model'].findAndCountAll(data);

    return list;
  } catch (error) {
    throw new Error(error);
  }
};

/**This function permit to create a instance, calling the create funtion sequelize
 * Parameters:
 * data object with properties and values to make query in database, as model, where, attributes, order, include
 * Response:
 * Response the new registry
 */
const create = async (model, data) => {
  try {
    let registry = await model.create(data);

    return registry;
  } catch (error) {
    throw new Error(error);
  }
};

/** This function permit to update a registry */
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

/** This function permit to delete a registry, updating deleted attribute in tables */
const deleted = async (model, id) => {
  try {
    let registry = await model.findOne({ where: { id, deleted: false } });
    if (!registry) throw new Error(`${message.elementNotFound}, 404`);

    registry.update({ deleted: true });

    return message.elementDeleted;
  } catch (error) {
    throw new Error(error);
  }
};

/** This function permit get values limit and offset to pagination query */
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

export { create, findOne, findAll, update, deleted, pagination };
