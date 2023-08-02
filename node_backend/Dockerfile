FROM node:18.16.0-buster-slim

WORKDIR  /app/node_backend

COPY ./config/package.json ./config/package-lock.json ./

RUN npm ci --quiet && npm cache clean --force

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "devStart"]
