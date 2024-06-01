FROM node:14-alpine

WORKDIR tfsapp

ARG QUESTIONS_SPREADSHEET

ENV HOST 0.0.0.0
ENV PORT 3000
ENV NODE_ENV production
ENV RAZZLE_QUESTIONS_SPREADSHEET=${QUESTIONS_SPREADSHEET}

RUN corepack enable
RUN yarn set version stable


# Installing dependencies
COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .

RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]