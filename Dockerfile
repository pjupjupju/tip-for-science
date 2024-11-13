FROM node:14-alpine

WORKDIR tfsapp

ARG QUESTIONS_SPREADSHEET
ARG DB_PASSWORD
ARG SUPABASE_KEY

ENV HOST 0.0.0.0
ENV PORT 3000
ENV NODE_ENV production
ENV RAZZLE_QUESTIONS_SPREADSHEET=${QUESTIONS_SPREADSHEET}
ENV RAZZLE_SUPABASE_KEY=${SUPABASE_KEY}
ENV RAZZLE_DB_PASSWORD=${DB_PASSWORD}

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