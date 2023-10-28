FROM node:12-alpine

WORKDIR /usr/src/app
COPY . ./
RUN npm install
EXPOSE 6081

ENV HOST=0.0.0.0
ENV PORT=6081

RUN npm run build

CMD [ "npm", "run", "start" ]
