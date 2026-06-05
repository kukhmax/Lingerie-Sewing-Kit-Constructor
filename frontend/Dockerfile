# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package config
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose Vite default dev port
EXPOSE 5173

# Start development server binding to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
