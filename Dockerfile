FROM arm32v7/debian:latest

RUN apt-get update
RUN apt-get -y install curl ruby
RUN curl -sL https://nodejs.org/dist/v12.18.4/node-v12.18.4-linux-armv7l.tar.xz -o node.tar.xz
RUN tar -xzf node.tar.gz
RUN cd node
RUN cp -R * /usr/local/
RUN npm install -g yarn
