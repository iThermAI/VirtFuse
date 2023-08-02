FROM node:18.16.0-buster-slim

WORKDIR  /usr/src/app/frontend

COPY ./config/package.json ./config/package-lock.json ./

COPY . .

RUN npm i --quiet && npm cache clean --force

# # for production
# RUN npm run build

CMD ["npm", "start"]