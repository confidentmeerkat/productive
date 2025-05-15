# Use Node.js LTS (Long Term Support) image as base
FROM node:22-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for Next.js development server
EXPOSE 3000

# Start Next.js in development mode with hot reloading
CMD ["npm", "run", "dev"]
