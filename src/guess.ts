export const wordToGuess = 'ghoul';

export type LetterStatus = 'correct' | 'incorrect' | 'wrong-position';

export type GuessResult = {
    letters: Array<{
        letter: string;
        status: LetterStatus;
    }>;
    isCorrect: boolean;
};

export function checkGuess(guess: string): GuessResult {
    console.log(`Checking guess: ${guess}`);
    const normalizedGuess = guess.toLocaleLowerCase();
    const result: GuessResult = {
        letters: [],
        isCorrect: normalizedGuess === wordToGuess,
    };

    normalizedGuess.split('').forEach((letter, index) => {
        if (letter === wordToGuess[index]) {
            result.letters.push({ letter, status: 'correct' });
        } else if (wordToGuess.includes(letter)) {
            // check that letter is found in correct position before or later in the word, if it is, then this one should be marked as incorrect, not wrong-position
            const letterCountInWord = (wordToGuess.match(new RegExp(letter, 'g')) || []).length; // how many times this letter appears in the word
            // find all positions of this letter in the word
            const correctPositions = wordToGuess.split('').reduce((count, l, i) => {
                if (l === letter && normalizedGuess[i] === letter) {
                    return count + 1;
                }
                return count;
            }, 0);
            const alreadyReportedAsIncorrectlyPositioned = result.letters.filter(l => l.letter === letter && l.status === 'wrong-position').length;
            // if the letter appears in the word more times than it is found in correct position, then we can mark this one as wrong-position, otherwise it should be marked as incorrect
            if (letterCountInWord > correctPositions + alreadyReportedAsIncorrectlyPositioned) {
                result.letters.push({ letter, status: 'wrong-position' });
            } else {
                result.letters.push({ letter, status: 'incorrect' });
            }
        } else {
            result.letters.push({ letter, status: 'incorrect' });
        }
    });

    return result;
}