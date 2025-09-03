# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Set environment variables (can be overridden)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Expose port
EXPOSE 3000

# Run depending on environment
# - dev: hot reload
# - prod: production build
CMD if [ "$NODE_ENV" = "production" ]; then \
    npm run build && npm start; \
    else \
    npm run dev; \
    fi
