import models from '../../database/models';
import { create } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import { encryptPassword } from '../utils/auxiliaries';

const User = models.users;
const Patient = models.patients;

const createRegistry = async (req, res) => {
  try {
    const { body } = req;

    body.password = encryptPassword(body.password);

    const user = await create(User, body);

    body.userId = user.id;

    const patient = await create(Patient, body);

    return httpResponse(201, patient, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

export { createRegistry };
