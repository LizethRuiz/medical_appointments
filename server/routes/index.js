import { Router } from 'express';
import fs from 'fs';

const router = Router();
const pathRouter = `${__dirname}`;

//Use this function to remove extension(js) to the files in folder routes
const removeExtension = (fileName) => {
  return fileName.split('.').shift();
};

// Filter files in this path, with router.use added other routers from files
fs.readdirSync(pathRouter).filter((file) => {
  const fileWithOutExt = removeExtension(file);
  const skip = ['index'].includes(fileWithOutExt);
  if (!skip) {
    router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`));
  }
});

router.get('*', (req, res) => {
  res.status(404).send({ error: 'Not found' });
});

module.exports = router;
