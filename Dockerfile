FROM node:12.16.1-alpine As build

WORKDIR /www/

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build:prod

#Download docker image
FROM nginx:1.15.8-alpine

COPY --from=build /www/ /usr/share/nginx/html