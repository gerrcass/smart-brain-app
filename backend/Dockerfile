FROM node:slim
WORKDIR /usr/src/smart-brain-api
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]