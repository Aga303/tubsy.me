FROM node

RUN npm install -g gulp-cli@1.2.2

RUN mkdir /gulp
WORKDIR /gulp

ADD package.json /gulp
ADD gulpfile.js /gulp
RUN npm install

ADD tsconfig.json /gulp

ENTRYPOINT gulp
