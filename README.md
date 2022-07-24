# Tip for Science 🎯

_Fullstack javascript app with React-based responsive UI._
This project was bootstrapped with create-react-app and Razzle.
It uses GraphQL for client-server communication and DynamoDB to store data.

## Requirements

- Node v14+
- Docker

## How to run locally

- clone this repository
- with node installed run: `yarn install`
- start database docker container: `docker-compose up`
- start server and ui with `yarn start` (UI will run on [http://localhost:3000](http://localhost:3000) and API with playground on [http://localhost:3000/api](http://localhost:3000/api))
- to allow running imports, generate or copy `google-credentials.json` to `src/server/io` folder

### Additionally you can:

- `yarn user:create:admin EMAIL PASSWORD` to create admin user
- `yarn storybook` to run storybook (catalogue of components).
- `yarn build` to create production build in the `build` folder.
- `yarn eject` to eject config files and edit them yourself (warning: this is a one-way operation)

## Happy coding!
