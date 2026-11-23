FROM node:22-bookworm-slim

# Python runs the job scraper.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-requests python3-feedparser \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

ENV NODE_ENV=production
CMD ["node", "server.js"]
