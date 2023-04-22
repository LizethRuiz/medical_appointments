/** Import local modules */
import models from '../../database/models';
import { create, findAll } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import { encryptPassword } from '../utils/auxiliaries';

/** Declare model names */
const User = models.users;
const Doctor = models.doctors;
const Address = models.addresses;

/** This controller permit create a registry as a doctor,
 * You must considerate the next parameters in body to create the account:
 * Information to create the user registry:
 * - name
 * - lastName
 * - email
 * - password
 * - phone
 * Specific information about doctor;
 * - speciality
 * - license (Porfessional license)
 * Address
 * -State
 * -City
 * -FullAddress
 * Responses:
 * 400 -> We get a 400 when exist a bad request
 * 201 -> We get a 201 when the doctor account was create
 */
const createRegistry = async (req, res) => {
  try {
    const { body } = req;

    /** Calling a funtion that encrypt a string in this case a password, The password is saved encrypted */
    body.password = encryptPassword(body.password);

    /** Calling a create function that make the insertion in database.
     * First create the user and address registry */
    const user = await create(User, body);
    const address = await create(Address, body);

    body.userId = user.id;
    body.addressId = address.id;

    /** With the user an address ids create the doctor registry */
    const doctor = await create(Doctor, body);

    return httpResponse(201, doctor, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

/** This controller permit to get a doctors' list,
 * Responses:
 * 200 -> We get a 200 when the doctors' list
 */
const getDoctors = async (req, res) => {
  try {
    let dataQuery = {
      model: Doctor, //Model, is the database table
      where: { deleted: false }, //Query conditions
      attributes: ['id', 'license', 'speciality'], // Table's attributes that we want to get
      include: [
        { model: User, attributes: ['name', 'lastName', 'email'] },
        {
          model: Address,
          attributes: ['state', 'city', 'fullAddress'],
        },
      ], //This permits add models associated with the main model(Doctor)
    };

    /** Calling findAll function from crud.js file, that makes the registry in database */
    const doctors = await findAll(dataQuery);

    return httpResponse(200, doctors, res);
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

export { createRegistry, getDoctors };
