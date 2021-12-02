FROM arm64v8/node:14-alpine
WORKDIR /code

COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./src ./src

RUN yarn --frozen-lockfile
RUN yarn build

FROM arm64v8/node:14-alpine
WORKDIR /code

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn --frozen-lockfile --production

FROM arm64v8/node:14-alpine
WORKDIR /code

ARG HOST
ENV HOST=$HOST
ARG PORT
ENV PORT=$PORT

EXPOSE $PORT

COPY --from=0 /code/dist /code
COPY --from=1 /code/node_modules /code/node_modules

CMD ["node", "-r", "./bootstrap.js", "./http/application"]
