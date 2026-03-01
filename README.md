# Shmordle

A minimal TypeScript client-server application that allows the user to guess a predefined word. The UI uses Material Design styling and displays per-letter status feedback.

## Structure

- `src/server.ts` – Express backend with a `/guess` endpoint returning detailed letter statuses.
- `src/guess.ts` – Game logic that evaluates a guess against the target word.
- `src/client.ts` – Frontend logic that posts a guess and renders styled responses.
- `public/index.html` – Material Design layout powered by Materialize CSS.
- `tsconfig.json` – TypeScript configuration.
- `package.json` – dependencies and build/dev scripts.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

This uses `ts-node` with `nodemon`; modifications to `src/` restart the server.

## Testing

```bash
npm test
```

Runs both unit tests for the guess logic and integration tests against the `/guess` endpoint.

## Build & Run

```bash
npm run build   # compile TypeScript into `dist/`
npm start       # run the compiled server
```

The server listens on port 3000 by default; open http://localhost:3000 in a browser to play the game.

The interface uses Material Design via Materialize CSS. Enter five-letter words; correct letters turn green, wrong-position letters yellow, and incorrect letters gray. History of past guesses is shown below and persists across reloads. New target words are selected automatically after a correct answer or six incorrect guesses.

---

Feel free to extend or style the frontend and add more endpoints as needed.