FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm run migrate

EXPOSE 8080
CMD [ "npm", "start" ]