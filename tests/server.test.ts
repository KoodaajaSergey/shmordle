import request from 'supertest';
import { app, _setCurrentWord } from '../src/server';

describe('POST /guess', () => {
  beforeEach(() => {
    // ensure predictable word
    _setCurrentWord('apple');
  });

  it('rejects non-string input', async () => {
    const res = await request(app).post('/guess').send({ word: 123 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('word must be a string');
  });

  it('rejects word not in list', async () => {
    const res = await request(app).post('/guess').send({ word: 'abcde' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('not-in-wordlist');
  });

  it('returns correct structure for wrong guess and decrements remaining', async () => {
    const res = await request(app).post('/guess').send({ word: 'about' });
    expect(res.status).toBe(200);
    expect(res.body.isCorrect).toBe(false);
    expect(res.body.newWord).toBe(false);
    expect(res.body.remaining).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.letters)).toBe(true);
  });

  it('marks as correct and resets new word flag', async () => {
    const res = await request(app).post('/guess').send({ word: 'apple' });
    expect(res.body.isCorrect).toBe(true);
    expect(res.body.newWord).toBe(true);
  });

  it('resets after max attempts', async () => {
    let lastResponse;
    for (let i = 0; i < 6; i++) {
      lastResponse = await request(app).post('/guess').send({ word: 'about' });
    }
    // the sixth attempt should trigger newWord flag
    expect(lastResponse!.body.newWord).toBe(true);
  });
});