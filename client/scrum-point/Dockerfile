# Stage 1: Build the React app with Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

RUN npm install --save-dev @types/node
# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy built files from the previous stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
