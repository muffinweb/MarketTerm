FROM node:19

WORKDIR /

COPY . .

RUN npm install

RUN echo "docker run -it marketterm_marketterm_1 node index.js"

CMD ["npm", "run", "app"]