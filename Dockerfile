FROM node:lts

# Install pnpm globally
RUN npm install -g pnpm

# Install Ghostscript and GraphicsMagick (required for pdf2pic)
RUN apt-get update && \
    apt-get install -y ghostscript graphicsmagick && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

EXPOSE 3030

CMD [ "node", "dist/main.js" ]