FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema
COPY prisma ./prisma

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port your app runs on
EXPOSE 3001

# Command to run the app
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/index.js"]
