FROM ubuntu:18.04

RUN apt update
RUN apt upgrade -y
RUN apt install nano nodejs npm -y

RUN mkdir -p /srv/app

WORKDIR /srv/app