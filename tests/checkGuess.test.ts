import { checkGuess } from '../src/guess';

describe('checkGuess', () => {
  const wordToGuess = 'ghoul';

  it('returns true when the guess matches exactly', () => {
    expect(checkGuess(wordToGuess).isCorrect).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(checkGuess(wordToGuess.toUpperCase()).isCorrect).toBe(true);
  });

  it('returns false for a wrong guess', () => {
    expect(checkGuess('wrong').isCorrect).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(checkGuess('').isCorrect).toBe(false);
  });

  // now lets check internal correctness
  it('returns correct letter statuses when all are correct', () => {
    const result = checkGuess('gHoul');
    expect(result.letters[0].status).toBe('correct');       
    expect(result.letters[1].status).toBe('correct');
    expect(result.letters[2].status).toBe('correct');
    expect(result.letters[3].status).toBe('correct');
    expect(result.letters[4].status).toBe('correct');
  });

  it('returns correct letter statuses when some are wrong position', () => {
    const result = checkGuess('Hgolu');
    expect(result.letters[0].status).toBe('wrong-position');       
    expect(result.letters[1].status).toBe('wrong-position');
    expect(result.letters[2].status).toBe('correct');
    expect(result.letters[3].status).toBe('wrong-position');
    expect(result.letters[4].status).toBe('wrong-position');
  });

  it('returns correct letter statuses when some are wrong and some are wrong position', () => {
    const result = checkGuess('agolu');
    expect(result.letters[0].status).toBe('incorrect');       
    expect(result.letters[1].status).toBe('wrong-position');
    expect(result.letters[2].status).toBe('correct');
    expect(result.letters[3].status).toBe('wrong-position');
    expect(result.letters[4].status).toBe('wrong-position');
  });

  // tricky test checking that if the letter has already been found in right position, it should not be marked as wrong-position later
  it('does not mark letters as wrong-position if they are already marked as correct', () => {
    const result = checkGuess('gghhh');
    expect(result.letters[0].status).toBe('correct');       
    expect(result.letters[1].status).toBe('incorrect');
    expect(result.letters[2].status).toBe('wrong-position');
    expect(result.letters[3].status).toBe('incorrect');
    expect(result.letters[4].status).toBe('incorrect');
  });
});
