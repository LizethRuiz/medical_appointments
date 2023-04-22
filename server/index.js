import routes from './routes';
import swaggerDocument from './../swagger.json';

import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';

let server = express();

server.use(cors());
server.use(express.json());
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
server.use('/api/v1', routes);

export default server;
