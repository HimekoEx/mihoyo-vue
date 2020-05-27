FROM node:latest as build
LABEL maintainer="Himeko<2455524718@qq.com>"

COPY ./ /app
WORKDIR /app
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install && npm run build

FROM nginx:alpine
LABEL maintainer="Himeko<2455524718@qq.com>"

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
