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

## Happy coding!
