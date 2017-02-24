FROM node

RUN mkdir /tmp/tubsy
ADD package.json /tmp/tubsy/

WORKDIR /tmp/tubsy
RUN npm install -g

CMD ["/bin/bash"]
