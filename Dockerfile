# Use the official Node.js image as the base, change to alpine if you want a smaller image
FROM node:19.0.0-slim

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && \
    apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-open-sans --no-install-recommends && \
    wget http://ftp.de.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.8_all.deb && \
    apt-get install -y cabextract xfonts-utils && \
    dpkg -i ttf-mscorefonts-installer_3.8_all.deb && \
    fc-cache -f -v && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container  
WORKDIR /app  

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