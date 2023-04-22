import server from './server/index';
import db from './database';
import keys from './config/environment';

db.authenticate().then(async () => {
  server.listen(keys.PORT, () =>
    console.log(`🚀 Server is running at ${keys.PORT} `)
  );
});
