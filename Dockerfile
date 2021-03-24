FROM node:14
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3001
CMD npm start