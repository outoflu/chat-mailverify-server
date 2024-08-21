FROM node:20.16.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 50051

CMD ["node","server.cjs"]