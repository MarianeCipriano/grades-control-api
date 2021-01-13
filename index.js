import express from 'express';
import { promisify } from 'util';
import fs from 'fs';
import winston from 'winston';
import gradesRouter from './routes/grades.js';
//let app = express();
const app = express();
const exist = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.fileName = 'grades.json';

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-control-api.log' })
  ],
  format: combine(label({ label: 'grades-control-api' }), timestamp(), myFormat)
});

app.use(express.json());
app.use(express.static('public'));
app.use('/image', express.static('public'));
app.use('/grades', gradesRouter);

app.listen(3001, async () => {
  try {
    const fileExist = await exist(global.fileName);
    if (!fileExist) {
      const initialJson = {
        next: 1,
        grades: []
      };
      await writeFile(global.fileName, JSON.stringify(initialJson));
    }
  } catch (err) {
    logger.error(err);
  }
  logger.info('API Started');
});
