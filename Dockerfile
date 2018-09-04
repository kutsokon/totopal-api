FROM node:latest
WORKDIR /totopal-api
COPY package*.json ./
RUN npm install
RUN npm install babel-cli -g
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
