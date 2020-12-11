FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install curl ruby
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn


