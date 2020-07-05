FROM node:12.12.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -qy

COPY . .

EXPOSE 3001

CMD ["npm","run" ,"start-without-clean"]
