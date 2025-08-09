FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
