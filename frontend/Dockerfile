FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose React development server
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
