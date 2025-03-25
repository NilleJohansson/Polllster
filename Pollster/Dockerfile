# Use Node.js as the base image
FROM node:16 as base

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./  
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Development mode
FROM base as dev
COPY . .  
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]  # Ensure npm is available here

# Production mode
FROM base as build
COPY . .
RUN npx update-browserslist-db@latest
RUN npm run build

# Use a lightweight web server to serve the app
FROM nginx:alpine as prod
# Copy the build files to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose the port Nginx is running on
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

