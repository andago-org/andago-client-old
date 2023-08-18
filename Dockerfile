# Use the official node image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files
COPY . .

# Build the Vue.js app for production
RUN yarn build

# Serve the app
CMD [ "yarn", "serve" ]
