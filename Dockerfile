FROM node:14-alpine

WORKDIR tfsapp

ENV HOST 0.0.0.0
ENV PORT 3000
ENV NODE_ENV production
ENV RAZZLE_CUSTOM_VAR tfsapp123

# Installing dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

RUN echo "{}" >> src/server/io/google-credentials.json

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]