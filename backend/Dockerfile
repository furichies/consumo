FROM node:18-bullseye
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
