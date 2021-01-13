import express from 'express';
import fs from 'fs';
import { promisify } from 'util';

//let promisify = require('util');

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
router.post('/', async (req, res) => {
  try {
    let grade = req.body;
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    grade = {
      id: data.nextId++,
      ...grade,
      timestamp: new Date()
    };
    data.grades.push(grade);
    await writeFile(global.fileName, JSON.stringify(data));
    res.end();
    loggers.info(`POST/grade - "${JSON.stringify(grade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
router.get('/', async (_, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    delete data.nextId;
    res.send(data);
    loggers.info(`GET/grade`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    const grade = data.grades.find(grade.id === parseInt(req.params.id, 10));
    if (grade) {
      res.send(grade);
    } else {
      res.end();
    }
    loggers.info(`GET/grade " ${(req, params.id)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    data.grades = data.grades.filter(
      grade => grade.id !== parseInt(req.params.id, 10)
    );

    loggers.info(`DELETE/grade " ${(req, params.id)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
router.put('/', async (req, res) => {
  try {
    const newGrade = req.body;
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    let oldGradeIndex = data.grades.findIndex(
      grade => grade.id === newGrade.id
    );
    data.grades[oldGradeIndex] = newGrade;
    await writeFile(global.fileName, JSON.stringify(data));
    res.end();
    logger.info(`PUT/grade -" ${JSON.stringify(data)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
//module.exports = router;
export default router;
