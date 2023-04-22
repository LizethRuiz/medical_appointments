/** Import local modules */
import models from '../../database/models';
import { findOne } from '../utils/crud';
import { getResponse, httpResponse } from '../utils/responses';
import message from '../utils/constants';
import { JWT } from '../../config/environment';

/** Import external modules */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/** Declare model names */
const User = models.users;
const Doctor = models.doctors;
const Patient = models.patients;

/** This controller permit to sign in as doctor o patient,
 * You must considerate the next parameters in body to sign In:
 * Information to create the user registry:
 * - email
 * - password
 * Responses:
 * 400 -> We get a 400 when exist a bad request like invalid credentials
 * 200 -> We get a 200 when the credentials were correct
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const dataQuery = {
      model: User,
      where: {
        email: email,
        deleted: false,
      }, // Considerate the email and active user
      include: [
        {
          model: Doctor,
          attributes: ['id'],
        },
        {
          model: Patient,
          attributes: ['id'],
        },
      ], //Including Doctor and Patient information
    };

    const user = await findOne(dataQuery);

    /** If user didn't find, response status 400 */
    if (!user) return httpResponse(400, message.invalidCredentials, res);

    /** If password doesn't match response status 400 */
    if (!bcrypt.compareSync(password, user.password))
      return httpResponse(400, message.invalidCredentials, res);

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };

    /** Perform JWT with payload information, seed (the sign) and date expire */
    const token = jwt.sign(
      {
        user: {
          id: user.id,
          doctor: user.doctor,
          patient: user.patient,
        },
      },
      JWT.SEED,
      { expiresIn: JWT.EXPIRES_TOKEN }
    );

    return res.status(200).send({ payload, token });
  } catch (error) {
    let { status, message } = getResponse(error);
    return httpResponse(status, message, res);
  }
};

export { signIn };
