# Build Stage
FROM node:lts AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm ci

# Copy application code
COPY . .

# Compile the TypeScript code
RUN npx tsc

# Production Stage
FROM node:lts-slim AS production

# Set environment
ENV NODE_ENV production

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/package-lock.json ./
COPY --from=build /usr/src/app/dist ./dist

# Install production dependencies
RUN npm ci --production

# Use non-root user
USER node

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "node", "dist/index.js" ]