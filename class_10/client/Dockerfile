# Install nodejs version 22
FROM node:22-alpine 

# Set working directory (where commands will be executed)
WORKDIR /app 

# Allow passing the API URL at build time for Vite (must start with VITE_)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package.json and package-lock.json for install caching
COPY package*.json ./ 

# Install dependencies reproducibly
# Uses package-lock.json; faster and deterministic for CI/builds
RUN npm ci

# Copy all files to working directory
COPY . . 

# Build the project (build will see VITE_API_URL via ENV)
RUN npm run build

# Application access port
EXPOSE 3000 

# Run the application and bind preview to all network interfaces
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]