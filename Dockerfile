FROM node

RUN npm install -g @angular/cli

WORKDIR /tmp/tubsy

ENTRYPOINT ["ng", "build"]
