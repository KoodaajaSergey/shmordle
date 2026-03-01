declare const M: any;

type Letter = { letter: string; status: string };

type GuessResult = { letters: Letter[]; isCorrect: boolean; newWord?: boolean; remaining?: number };

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
    //row.className = 'card-panel white z-depth-1';

    const lettersDiv = document.createElement('div');
    lettersDiv.className = 'letters';

    entry.letters.forEach((l) => {
      const span = document.createElement('span');
      span.textContent = l.letter.toUpperCase();
      span.className = 'letter-box ' + l.status;
      lettersDiv.appendChild(span);
    });

    row.appendChild(lettersDiv);
    container.appendChild(row);
  });
}

// submit guess to server and store history
async function submitGuess() {
  const input = document.getElementById('guessInput') as HTMLInputElement;

  const value = input.value.trim();
  // empty the input immediately for better UX
  input.value = '';
  if (!/^[a-zA-Z]{5}$/.test(value)) {
    M.toast({ html: 'Please enter a 5-letter word' });
    return;
  }

  const resp = await fetch('/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: value })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    M.toast({ html: err.error || 'Server error' });
    return;
  }

  const data: GuessResult = await resp.json();

  const history = loadHistory();
  history.push(data);
  // limit to last 50
  if (history.length > 50) history.shift();
  saveHistory(history);
  renderHistory();

  if (data.newWord) {
    M.toast({ html: data.isCorrect ? 'Correct! New word set.' : 'No guesses left; new word set.' });    
    localStorage.removeItem(HISTORY_KEY);
  } else {
    M.toast({ html: `Remaining: ${data.remaining}` });
  }
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
