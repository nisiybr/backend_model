import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import '@shared/infra/typeorm';
import 'express-async-errors';
import { errors } from 'celebrate';

import '@shared/container';
import AppError from '@shared/errors/AppError';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

// middleware de erro tem 4 parametros
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Erro conhecido, gerado pelo AppError, ou seja, gerado pela minha aplicação
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Backend voando!!');
});
