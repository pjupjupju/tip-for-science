FROM node:14-alpine

WORKDIR tfsapp

ARG QUESTIONS_SPREADSHEET

ENV HOST 0.0.0.0
ENV PORT 3000
ENV NODE_ENV production
ENV RAZZLE_QUESTIONS_SPREADSHEET=${QUESTIONS_SPREADSHEET}

# Installing dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]