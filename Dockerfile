# Use a Nonroot Container User 
# NOTE: choose the image with the smallest size that can run my Node.js app

FROM node:slim
# FROM node:12-alpine 

# RUN mkdir /usr/src/smart-brain-api/ && chown -R node:node /usr/src/smart-brain-api

WORKDIR /usr/src/smart-brain-api

# COPY --chown=node:node ./ ./
COPY ./ ./

# USER node

# RUN npm install && npm cache clean --force --loglevel=error
RUN npm install

CMD [ "node", "server.js"]

# CMD [ "/bin/bash"]