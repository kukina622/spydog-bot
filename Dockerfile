FROM node:18
LABEL maintainer="Min"

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

# CMD [ "yarn", "ts-node", "src/app.ts" ]
