
FROM node:12-alpine as base
RUN \
  mkdir --parents /node/production \
  && apk add --no-cache nodejs-current tini
WORKDIR /node/production
ENTRYPOINT ["/sbin/tini", "--"]
COPY . .

FROM base AS dependencies
RUN \
  apk update \
  && apk add --no-cache --virtual build-deps \
    python \
    g++ \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
  && npm install --production \
  && npm build \
  && apk del build-deps

FROM base AS release
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /app
COPY --from=dependencies /node/production/dist ./dist/
COPY --from=dependencies /node/production/node_modules ./node_modules/
COPY examples/ ./examples/
COPY src/ ./src/
COPY \
  .babelrc \
  .eslintignore \
  .eslintrc.js \
  .sequelizerc \
  LICENSE.md \
  package-lock.json	\
  package.json \
  swagger-options.json \
  ./

RUN \
  apk update \
  && apk add --no-cache \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    pangomm \
    libjpeg-turbo \
    freetype \
  && touch /app/.env

EXPOSE 8081
CMD npm run start
