import express, { Request, Response } from 'express';
import path from 'path';
import { checkGuess } from './guess';

const app = express();
app.use(express.json());

// serve static assets: HTML first, then compiled client JS
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.post('/guess', (req: Request, res: Response) => {
  const { word } = req.body;
  if (typeof word !== 'string') {
    return res.status(400).json({ error: 'word must be a string' });
  }
  const result = checkGuess(word);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});