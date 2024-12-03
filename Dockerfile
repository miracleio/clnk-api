# Build Stage
FROM node:lts AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Compile the TypeScript code
RUN npm run compile

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

# Switch to non-root user
USER node

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "node", "dist/index.js" ]