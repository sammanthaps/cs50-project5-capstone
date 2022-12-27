FROM node

WORKDIR /project5/frontend

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build