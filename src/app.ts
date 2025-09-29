import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app: Express = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Server started and READY!');
});

export default app;
