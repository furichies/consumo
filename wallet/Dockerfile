FROM node:18-bullseye
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 4100
CMD ["node", "service.js"]
