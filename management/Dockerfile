# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if you use Yarn)
# This step leverages Docker layer caching. If these files don't change,
# Docker won't re-run npm install unless the cache is invalidated.
COPY package*.json ./

# Install project dependencies
# Using --only=development or similar flags might be needed if you have issues with devDependencies
# For a simple setup, just npm install is fine.
RUN npm install

# Copy the rest of the application's source code from your context
# (the ./management directory on your host) to the working directory in the container.
COPY . .

# The port the application will run on. This is for documentation;
# the actual port mapping is done in docker-compose.yml.
# EXPOSE 3000

# The command to run when the container starts for development.
# This will be overridden by the command in docker-compose.yml if specified there,
# but it's good practice to have a default command here.
# 'npm run start:dev' is typical for NestJS hot-reloading.
CMD [ "npm", "run", "start:dev" ]
