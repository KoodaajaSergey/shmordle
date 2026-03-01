export type LetterStatus = 'correct' | 'incorrect' | 'wrong-position';

export type GuessResult = {
    letters: Array<{
        letter: string;
        status: LetterStatus;
    }>;
    isCorrect: boolean;
};

export function checkGuess(guess: string, target: string): GuessResult {
    console.log(`Checking guess: ${guess} against ${target}`);
    const normalizedGuess = guess.toLocaleLowerCase();
    const normalizedTarget = target.toLocaleLowerCase();
    const result: GuessResult = {
        letters: [],
        isCorrect: normalizedGuess === normalizedTarget,
    };

    normalizedGuess.split('').forEach((letter, index) => {
        if (letter === normalizedTarget[index]) {
            result.letters.push({ letter, status: 'correct' });
        } else if (normalizedTarget.includes(letter)) {
            const letterCountInWord = (normalizedTarget.match(new RegExp(letter, 'g')) || []).length;
            const correctPositions = normalizedTarget.split('').reduce((count, l, i) => {
                if (l === letter && normalizedGuess[i] === letter) {
                    return count + 1;
                }
                return count;
            }, 0);
            const alreadyReportedAsWrongPosition = result.letters.filter(l => l.letter === letter && l.status === 'wrong-position').length;
            if (letterCountInWord > correctPositions + alreadyReportedAsWrongPosition) {
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