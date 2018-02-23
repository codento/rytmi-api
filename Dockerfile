FROM node:9.5.0-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .