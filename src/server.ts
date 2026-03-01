import express, { Request, Response } from 'express';
import path from 'path';
import { checkGuess, GuessResult } from './guess';
import wordles from 'wordles';
import nonwordles from 'wordles/nonwordles';

export const app = express();
app.use(express.json());

// serve static assets: HTML first, then compiled client JS
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
const combined = [...wordles, ...nonwordles].sort();
const MAX_ATTEMPTS = 6;

function pickRandomWord() {
  return combined[Math.floor(Math.random() * combined.length)];
}

let currentWord = pickRandomWord();
let attempts = 0;
let history: Array<{ guess: string; result: GuessResult }> = [];

// helpers for testing
export function _setCurrentWord(word: string) {
  currentWord = word.toLocaleLowerCase();
  attempts = 0;
  history = [];
}
export function _getCurrentWord() {
  return currentWord;
}

app.post('/guess', (req: Request, res: Response) => {
  const { word } = req.body;
  if (typeof word !== 'string') {
    return res.status(400).json({ error: 'word must be a string' });
  }

  const normalized = word.toLocaleLowerCase();
  // validate against combined word list
  if (!combined.includes(normalized)) {
    return res.status(400).json({ error: 'not-in-wordlist' });
  }

  const result = checkGuess(normalized, currentWord);
  history.push({ guess: normalized, result });
  attempts += 1;

  if (result.isCorrect) {
    // successful guess -> pick new word and reset
    currentWord = pickRandomWord();
    attempts = 0;
    history = [];
    return res.json({ letters: result.letters, isCorrect: true, newWord: true, remaining: MAX_ATTEMPTS });
  }

  if (attempts >= MAX_ATTEMPTS) {
    // exhausted attempts -> pick new word and reset
    currentWord = pickRandomWord();
    attempts = 0;
    history = [];
    return res.json({ letters: result.letters, isCorrect: false, newWord: true, remaining: 0 });
  }

  return res.json({ letters: result.letters, isCorrect: false, newWord: false, remaining: MAX_ATTEMPTS - attempts });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}