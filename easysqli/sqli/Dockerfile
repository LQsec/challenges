FROM node:latest

RUN mkdir /app
COPY assets/ /app
COPY assets/welcome.dat /
COPY flag /

RUN chmod -R 700 /app && chmod 444 /flag

WORKDIR /app
RUN npm install 

EXPOSE 8000

CMD ["node", "index.js"]