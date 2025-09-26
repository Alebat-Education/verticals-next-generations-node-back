import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import type { Request, Response } from 'express';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server started and READY!');
});

export default app;
