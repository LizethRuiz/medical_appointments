/** Import local modules */
import { JWT } from '../../config/environment';
import { httpResponse } from '../utils/responses';
import message from '../utils/constants';

/** Import external modules */
import jwt from 'jsonwebtoken';

/** This funtion is used as middleware in routes to verify the token.
 * To do a request service you must send the Authorization Bearer {Token}
 * This function take the token, and verify. when is decoded the information
 * is saved in the req as a user property, this property can be used in all controllers
 * that implement the verifyToken middleware
 */
const verifyToken = async (req, res, next) => {
  try {
    /** If token isn't in request, raise error */
    if (!req.get('Authorization')) throw new Error(message.tokenRequired);

    /**Separate the string */
    const token = req.get('Authorization').split('Bearer');

    /** Verify the token with the sign (SEED), the funtion verify is from jsonwebtoken package */
    const decoded = jwt.verify(token[1].trim(), JWT.SEED);

    /** Save the user information from token in user property req */
    req.user = decoded.user;

    next();
  } catch (error) {
    return httpResponse(401, error.message, res);
  }
};

/** This middleware is a funtion, implement in route to validate
 * permission of users to access services in the API
 * Parameters:
 * - rol: Is the name of rol {doctor} or {patient} it's because there are routes that patients or
 *  doctors shouldn't access
 * */
const checkPermissions = (rol) => {
  try {
    return (req, res, next) => {
      const user = req.user;

      /**Here use the user property in req to validate if contain the rol */
      if (user[rol] !== null) {
        next();
      } else {
        return httpResponse(401, message.deniedPermission, res);
      }
    };
  } catch (error) {
    return httpResponse(401, error.message, res);
  }
};

export { verifyToken, checkPermissions };
