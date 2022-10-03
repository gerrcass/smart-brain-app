FROM node:slim

# Create app directory
WORKDIR /usr/src/smart-brain-web

# Copy dependency definitions
COPY package.json ./

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm install

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]