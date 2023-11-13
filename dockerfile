FROM node:18
LABEL maintainer="Min"

WORKDIR /app
COPY ./ /app

RUN yarn install

CMD [ "yarn", "start" ]
