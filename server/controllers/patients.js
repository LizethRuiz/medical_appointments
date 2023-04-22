/** Import local modules */
import models from '../../database/models';
import { create } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import { encryptPassword } from '../utils/auxiliaries';

/** Define model names */
const User = models.users;
const Patient = models.patients;

/** This controller permit create a registry as a patient,
 * You must considerate the next parameters in body to create the account:
 * Information to create the user registry:
 * - name
 * - lastName
 * - email
 * - password
 * - phone
 * Responses:
 * 400 -> We get a 400 when exist a bad request
 * 201 -> We get a 201 when the patient account was create
 */
const createRegistry = async (req, res) => {
  try {
    const { body } = req;

    /**Calling the function to encryp password */
    body.password = encryptPassword(body.password);

    /** Calling function that insert in the database */
    const user = await create(User, body);

    body.userId = user.id;

    /** Create patient registry with user information */
    const patient = await create(Patient, body);

    return httpResponse(201, patient, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

export { createRegistry };
