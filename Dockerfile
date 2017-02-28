FROM node
EXPOSE 8080

RUN npm install -g http-server

ENTRYPOINT http-server /home/node/src/
