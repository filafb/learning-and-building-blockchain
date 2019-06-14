FROM node:alpine

COPY . /app

WORKDIR /app

RUN npm install

ENV PORT 80
EXPOSE 80

CMD [ "npm", "start" ]
