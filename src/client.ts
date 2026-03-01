type Letter = { letter: string; status: string };

type GuessResult = { letters: Letter[]; isCorrect: boolean };

const HISTORY_KEY = 'guessHistory_v1';

function loadHistory(): GuessResult[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(h: GuessResult[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

function renderHistory() {
  const container = document.getElementById('history') as HTMLElement;
  container.innerHTML = '';
  const history = loadHistory();
  history.slice().reverse().forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'card-panel white z-depth-1';

    const lettersDiv = document.createElement('div');
    lettersDiv.className = 'letters';

    entry.letters.forEach((l) => {
      const span = document.createElement('span');
      span.textContent = l.letter.toUpperCase();
      span.className = 'letter-box ' + l.status;
      lettersDiv.appendChild(span);
    });

    const meta = document.createElement('div');
    meta.className = 'grey-text text-darken-1';
    meta.textContent = entry.isCorrect ? 'Correct' : 'Incorrect';

    row.appendChild(lettersDiv);
    row.appendChild(meta);
    container.appendChild(row);
  });
}

// submit guess to server and store history
async function submitGuess() {
  const input = document.getElementById('guessInput') as HTMLInputElement;
  const value = input.value.trim();
  if (!value) return;

  const resp = await fetch('/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: value })
  });
  const data: GuessResult = await resp.json();

  const history = loadHistory();
  history.push(data);
  // limit to last 50
  if (history.length > 50) history.shift();
  saveHistory(history);
  renderHistory();
}

document.getElementById('guessBtn')!.addEventListener('click', submitGuess);

// allow Enter key on input
const guessInput = document.getElementById('guessInput') as HTMLInputElement;
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitGuess();
});

// clear history button
const clearBtn = document.getElementById('clearHistory') as HTMLButtonElement | null;
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });
}

// initial render
renderHistory();
