# Use the official Node.js image as the base  
FROM node:alpine

# Set the working directory inside the container  
WORKDIR /app  

RUN apt-get update && apt-get install -y chromium

# Optionally, skip Puppeteer's Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Copy package.json and package-lock.json to the container  
COPY package.json yarn.lock ./

COPY prisma ./prisma/

# Install dependencies  
RUN yarn install

# Copy the app source code to the container  
COPY . .  

# Build the Next.js app  
RUN yarn build

RUN npx prisma generate

# Expose the port the app will run on  
EXPOSE 3000  

# Start the app  
CMD ["yarn", "start"]  