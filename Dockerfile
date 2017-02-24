FROM node
EXPOSE 3000

RUN npm install -g hello-world-server

ENTRYPOINT hello-world-server
