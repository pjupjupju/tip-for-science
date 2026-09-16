# Tip for Science 🎯

_Fullstack javascript app with React-based responsive UI._

<img width="1068" alt="Snímek obrazovky 2022-08-01 v 23 05 10" src="https://user-images.githubusercontent.com/373788/182246541-131a71f3-d87e-4074-99f7-55bab9a3b935.png">


This project was bootstrapped with create-react-app and Razzle.
It uses GraphQL for client-server communication and DynamoDB to store data.

## Requirements

- Node v14+
- Docker
- optionally Yarn (or else use `npm` instead of `yarn` in commands)

## How to run locally

- clone this repository
- with node installed run: `yarn install` for yarn or `npm install` for npm
- start database docker container: `docker-compose up`
- start server and ui with `yarn start` (UI will run on [http://localhost:3000](http://localhost:3000) and API with playground on [http://localhost:3000/api](http://localhost:3000/api))
- to allow running imports, generate or copy `google-credentials.json` to `src/server/io` folder

### Additionally you can:

- `yarn user:create:admin EMAIL PASSWORD` to create admin user
- `yarn storybook` to run storybook (catalogue of components).
- `yarn build` to create production build in the `build` folder.
- `yarn eject` to eject config files and edit them yourself (warning: this is a one-way operation)

## Languages and translation imports

Guest full-page loads always detect language from IP. A `tfs_language` cookie is
used only as a fallback if that lookup fails; a cookie does not skip detection.
For signed-in users, the saved account language controls both the interface and
dynamic questions, with no IP lookup. Server rendering preloads `AUTH_QUERY` and
reuses its Apollo cache in the provider and app instead of fetching the account
again for language selection.

The server sets a one-year, HttpOnly, SameSite=Lax language cookie (Secure in
production), and updates it on signup, signin, and language changes. The account
preference takes precedence over an older cookie. Language no longer uses
`localStorage`; old values are ignored. IP detection also supplies the initial
language during signup or signin when an existing account has no saved language.

After successful signup, users are redirected to `/profile/settings`, where they
can change the suggested language using the language picker and save it.

The admin dashboard loads translation tabs from `RAZZLE_QUESTIONS_SPREADSHEET`,
excluding `import`. Tab names must match language codes registered in the
`language` table. Each tab has a header, followed by these columns:

| A | B | C | D |
| --- | --- | --- | --- |
| Question ID (`id_in_sheet`) | Translated question | Fact (optional) | Unit (optional) |

Imports match each sheet ID to exactly one generated question ID and update or
insert by `(lang, question_id)`. Empty optional cells are saved as empty strings.
Invalid/duplicate sheet rows or unknown/ambiguous question IDs reject the entire
import. A transaction and database advisory lock serialize imports, including
concurrent requests, without requiring a new PostgreSQL constraint. Any other
writer to `question_translations` must use the same lock or a database uniqueness
constraint. The result includes inserted/updated counts and errors. Both imports
and translation-tab discovery require administrator privileges.

Run regression tests with `CI=true yarn test --runInBand --watchAll=false --watchman=false`.
For SQL integration checks, point `TEST_DATABASE_URL` at a disposable local
PostgreSQL database named `translation_import_test`, then run
`yarn exec ts-node --transpile-only migrations/test_translation_import.ts`.
The check creates an isolated schema; discard the test database afterward.

## Happy coding!
