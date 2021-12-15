FROM arm64v8/node:16-alpine
WORKDIR /code

COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./src ./src

RUN yarn --frozen-lockfile
RUN yarn build

FROM arm64v8/node:16-alpine
WORKDIR /code

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn --frozen-lockfile --production

FROM arm64v8/node:16-alpine
WORKDIR /code

ARG SLACK_SIGNING_SECRET
ENV SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET
ARG SLACK_BOT_TOKEN
ENV SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN
ARG SLACK_APP_TOKEN
ENV SLACK_APP_TOKEN=$SLACK_APP_TOKEN
ARG IMGUR_CLIENT_ID
ENV IMGUR_CLIENT_ID=$IMGUR_CLIENT_ID

COPY --from=0 /code/dist /code
COPY --from=1 /code/node_modules /code/node_modules

CMD ["node", "-r", "./bootstrap.js", "./server"]
