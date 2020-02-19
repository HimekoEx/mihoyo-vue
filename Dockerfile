FROM node:latest as build
COPY ./ /app
WORKDIR /app
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install && cnpm run build

FROM nginx:alpine
MAINTAINER mileskong <2455524719@qq.com>

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html