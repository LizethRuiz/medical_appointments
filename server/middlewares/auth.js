import { JWT } from '../../config/environment';
import { httpResponse } from '../utils/responses';
import message from '../utils/constants';

import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  try {
    if (!req.get('Authorization')) throw new Error(message.tokenRequired);

    const token = req.get('Authorization').split('Bearer');

    const decoded = jwt.verify(token[1].trim(), JWT.SEED);

    req.user = decoded.user;

    next();
  } catch (error) {
    return httpResponse(401, error.message, res);
  }
};

const checkPermissions = (rol) => {
  try {
    return (req, res, next) => {
      const user = req.user;

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
