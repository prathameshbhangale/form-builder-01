# Step 1: Set up base image
FROM node:18

# Step 2: Set build argument for VITE_API_BASE_URL
ARG VITE_API_BASE_URL

# Step 3: Set environment variable for runtime
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Step 4: Set working directory inside the container
WORKDIR /app

# Step 5: Copy package files to the container
COPY package.json package-lock.json ./

# Step 6: Install dependencies
RUN npm install

# Step 7: Copy the entire app to the container
COPY . .

# Step 8: Expose the correct port (5173 for your app)
EXPOSE 5173

# Step 9: Start the app using the dev command
CMD ["npm", "run", "dev"]
