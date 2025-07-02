# Use Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and environment file
COPY . .

# Expose port (should match the one in .env)
EXPOSE 8001

# Start the server
CMD ["node", "app.js"]
