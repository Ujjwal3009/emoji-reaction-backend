# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && \
    chown -R node:node /app/logs

# Build TypeScript
RUN npm run build

# Switch to non-root user
USER node

# Add healthcheck with more detailed output
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || (echo "Health check failed" && exit 1)

# Expose the port the app runs on 
EXPOSE 5000

# Use node to run the compiled JavaScript with more verbose logging
CMD ["node", "dist/server.js"]