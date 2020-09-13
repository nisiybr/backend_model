import express from 'express';
import cors from 'cors';
import '@shared/infra/typeorm';
import 'reflect-metadata';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World!!!' });
});

app.listen(3333, () => {
  console.log('Backend voando!!');
});
